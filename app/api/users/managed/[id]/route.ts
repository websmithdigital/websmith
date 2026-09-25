import { apiHandler, json, jsonBody, forbidden, notFound, parseObjectId } from "@/lib/server/api";

export const GET = apiHandler(async ({ db, user, params }) => {
  if (user.role !== "admin") throw forbidden();
  const id = parseObjectId(params.id);
  const targetUser = await db.collection("users").findOne({ _id: id });
  if (!targetUser) throw notFound("User not found");
  const { password: _, ...safeUser } = targetUser;
  return json({ data: { ...safeUser, _id: targetUser._id.toString() } });
}, { auth: "required" });

export const PUT = apiHandler(async ({ db, request, user, params }) => {
  if (user.role !== "admin") throw forbidden();
  const id = parseObjectId(params.id);
  const body = await jsonBody(request);
  const targetUser = await db.collection("users").findOne({ _id: id });
  if (!targetUser) throw notFound("User not found");

  const update: any = { updatedAt: new Date() };
  if (typeof body.name === "string") update.name = body.name.trim();
  if (typeof body.email === "string") update.email = body.email.trim().toLowerCase();
  if (typeof body.phone === "string") update.phone = body.phone.trim();
  if (typeof body.company === "string") update.company = body.company.trim();
  if (body.role && ["admin", "developer", "client"].includes(body.role)) update.role = body.role;
  if (body.adminLevel && ["super", "sub"].includes(body.adminLevel)) update.adminLevel = body.adminLevel;
  if (body.status && ["active", "inactive", "on-leave"].includes(body.status)) update.status = body.status;

  const result = await db.collection("users").findOneAndUpdate(
    { _id: id },
    { $set: update },
    { returnDocument: "after" }
  );
  if (!result) throw notFound("User not found");
  const { password: _, ...safeUser } = result;
  return json({ data: { ...safeUser, _id: result._id.toString() } });
}, { auth: "required" });

export const DELETE = apiHandler(async ({ db, user, params }) => {
  if (user.role !== "admin") throw forbidden();
  const id = parseObjectId(params.id);
  if (id.equals(user._id)) return json({ success: false, error: "You cannot delete your own account", message: "You cannot delete your own account" }, { status: 400 });
  const result = await db.collection("users").deleteOne({ _id: id });
  if (result.deletedCount === 0) throw notFound("User not found");
  return json({ message: "User deleted" });
}, { auth: "required" });
