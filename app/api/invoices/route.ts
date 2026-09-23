import { apiHandler, jsonBody, json, forbidden, badRequest, ObjectId } from "@/lib/server/api";
import { sendEmail } from "@/lib/email/mailer";

function computeAmount(items: any[], tax: number, discount: number): number {
  const subtotal = (items || []).reduce((sum: number, item: any) => sum + Number(item.quantity ?? 0) * Number(item.rate ?? 0), 0);
  const afterDiscount = Math.max(0, subtotal - (Number(discount) || 0));
  const total = Math.round(afterDiscount * (1 + (Number(tax) || 0) / 100) * 100) / 100;
  return total;
}

export const GET = apiHandler(async ({ db, user }) => {
  const filter: any = {};
  if (user.role === "client") {
    const userOrFilters: any[] = [
      { clientId: user._id.toString() },
      { clientId: user._id },
    ];
    if (user.customId) {
      userOrFilters.push({ clientId: user.customId });
      userOrFilters.push({ customClientId: user.customId });
    }
    if (user.email) {
      userOrFilters.push({
        clientEmail: { $regex: new RegExp(`^${user.email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      });
    }
    filter.$or = userOrFilters;
  }
  const invoices = await db.collection("invoices").find(filter).sort({ createdAt: -1 }).toArray();
  return json({ data: invoices.map((i) => ({ ...i, _id: i._id.toString() })) });
}, { auth: "required" });

export const POST = apiHandler(async ({ db, request, user }) => {
  if (user.role !== "admin") throw forbidden();
  const body = await jsonBody(request);
  const clientName = String(body.clientName ?? "").trim();
  const clientEmail = String(body.clientEmail ?? "").trim();
  if (!clientName || !clientEmail) throw badRequest("Client name and email are required");
  if (!Array.isArray(body.items) || body.items.length === 0) throw badRequest("At least one invoice item is required");

  const count = await db.collection("invoices").countDocuments();
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const invoiceNumber = body.invoiceNumber || `INV-${ymd}-${String(count + 1).padStart(4, "0")}`;

  const tax = body.tax == null ? 0 : Number(body.tax);
  const discount = body.discount == null ? 0 : Number(body.discount);
  const amount = computeAmount(body.items, tax, discount);

  // Resolve client from users collection to ensure both clientId and customClientId are cleanly stored
  let resolvedClientId: string | null = body.clientId ? String(body.clientId).trim() : null;
  let customClientId: string | null = null;
  let clientUser: any = null;

  if (resolvedClientId) {
    const userQueries: any[] = [{ customId: resolvedClientId }];
    try {
      userQueries.push({ _id: new ObjectId(resolvedClientId) });
    } catch {}
    clientUser = await db.collection("users").findOne({ $or: userQueries });
  }

  if (!clientUser && clientEmail) {
    clientUser = await db.collection("users").findOne({
      role: "client",
      email: { $regex: new RegExp(`^${clientEmail.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });
  }

  if (clientUser) {
    resolvedClientId = clientUser._id.toString();
    customClientId = clientUser.customId || null;
  }

  const doc = {
    clientId: resolvedClientId,
    customClientId,
    projectId: body.projectId ? String(body.projectId) : null,
    billingType: body.billingType || "project_completion",
    milestoneLabel: body.milestoneLabel ? String(body.milestoneLabel) : "",
    invoiceNumber,
    clientName,
    clientEmail,
    clientAddress: String(body.clientAddress ?? ""),
    amount,
    paidAmount: 0,
    dueAmount: amount,
    status: "pending",
    issueDate: body.issueDate || now.toISOString(),
    dueDate: body.dueDate || now.toISOString(),
    items: body.items.map((item: any) => ({
      description: String(item.description ?? ""),
      quantity: Number(item.quantity ?? 0),
      rate: Number(item.rate ?? 0),
      amount: Number(item.quantity ?? 0) * Number(item.rate ?? 0),
    })),
    notes: body.notes ? String(body.notes) : "",
    tax,
    discount,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("invoices").insertOne(doc);
  const insertedId = result.insertedId.toString();

  // Send Invoice Notification Email to Client
  try {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.WEBSITE_URL || "http://localhost:3000";
    const portalUrl = `${baseUrl}/client/invoices`;

    const issueDateStr = new Date(doc.issueDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const dueDateStr = new Date(doc.dueDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const emailRes = await sendEmail(
      null,
      "invoice_created",
      { email: clientEmail, name: clientName },
      {
        customer_name: clientName,
        invoice_number: invoiceNumber,
        project_name: body.projectName || (doc.items[0]?.description) || "Project Services",
        description: doc.items[0]?.description || "Professional Services",
        billing_type: String(doc.billingType).replace(/_/g, " ").toUpperCase(),
        issue_date: issueDateStr,
        due_date: dueDateStr,
        total_amount: formattedAmount,
        portal_url: portalUrl,
      }
    );

    if (!emailRes.success) {
      console.warn(`[Invoice] Email dispatch notice for ${invoiceNumber}:`, emailRes.error);
    } else {
      console.log(`[Invoice] Email dispatched successfully to ${clientEmail} for invoice ${invoiceNumber}`);
    }
  } catch (emailErr) {
    console.error("[Invoice] Failed to dispatch invoice creation email:", emailErr);
  }

  // Create In-App Notification if client user exists
  if (clientUser) {
    try {
      const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      await db.collection("notifications").insertOne({
        recipientId: clientUser._id.toString(),
        senderId: user._id.toString(),
        type: "invoice",
        message: `New invoice ${invoiceNumber} issued for ${formattedAmount}. Due by ${new Date(doc.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`,
        isRead: false,
        metadata: {
          invoiceId: insertedId,
          invoiceNumber,
          amount,
        },
        createdAt: now,
        updatedAt: now,
      });
    } catch (notifErr) {
      console.error("[Invoice] Failed to insert in-app notification:", notifErr);
    }
  }

  return json({ data: { ...doc, _id: insertedId } }, { status: 201 });
}, { auth: "required" });
