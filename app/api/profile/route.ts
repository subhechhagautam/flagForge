import { NextResponse } from "next/server";
import User from "@/models/userQuestionSchema";
import connect from "@/utlis/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET /api/profile
// export async function GET(_req: any) {
  
// }
