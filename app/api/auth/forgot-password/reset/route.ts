import { NextResponse } from "next/server";
import { getDb } from "@/lib/backend-db";
import { getPortalDb } from "@/lib/server/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  let pgClient = null;

  try {
    const { email, newPassword, confirmPassword, otp } = await request.json();

    if (!email || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Email, new password, and confirm password are required" },
        { status: 400 }
      );
    }

    if (!otp) {
      return NextResponse.json(
        { success: false, error: "OTP is required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const pool = await getDb();
    pgClient = await pool.connect();

    const otpResult = await pgClient.query(
      `SELECT id FROM otp_verifications
       WHERE email = $1 AND purpose = $2 AND verified = true
       ORDER BY created_at DESC
       LIMIT 1`,
      [email.trim().toLowerCase(), "password_reset"]
    );

    if (otpResult.rows.length === 0) {
      pgClient.release();
      pgClient = null;
      return NextResponse.json(
        { success: false, error: "OTP not verified. Please verify your OTP first." },
        { status: 400 }
      );
    }

    const noreplyEmail = email.trim().toLowerCase();

    const db = getPortalDb();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email: noreplyEmail });
    if (!user) {
      pgClient.release();
      pgClient = null;
      return NextResponse.json(
        { success: false, error: "Account not found in authentication system" },
        { status: 404 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          passwordResetOtpHash: "",
          passwordResetOtpExpiresAt: "",
          passwordResetOtpVerified: "",
        },
      }
    );

    await pgClient.query(
      `DELETE FROM otp_verifications WHERE email = $1 AND purpose = $2`,
      [noreplyEmail, "password_reset"]
    );

    pgClient.release();
    pgClient = null;

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Password reset error (internal):", errMsg);
    if (pgClient) {
      try { pgClient.release(); } catch (_) {}
    }
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
