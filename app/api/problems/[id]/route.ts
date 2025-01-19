import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import QuestionModel from "@/models/qustionsSchema";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import userSchema from "@/models/userSchema";
import UserQuestionModel from "@/models/userQuestionSchema";



export async function GET(
  _: NextRequest,
  { params }: { params: { id: string; }; }
) {
  try {
    await connect();
    const qustion = await QuestionModel.findById(params.id);
    qustion.flag = undefined;
    if (qustion) {
      return NextResponse.json({ qustion });
    }
    return NextResponse.json(
      { message: `Product ${params.id} not found` },
      { status: HttpStatusCode.NotFound }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error },
      { status: HttpStatusCode.BadRequest }
    );
  }
}




export async function POST(req: NextRequest, { params }: { params: { id: string; }; }) {
  try {
    await connect();
    const body: { flag: string; } = await req.json();
    const question = await QuestionModel.findById(params.id);
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await userSchema.findOne({ email: session?.user?.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    if (body.flag == question.flag) {
      user.totalScore = (user.totalScore || 0) + question.points;
      // const userQuestion = await UserQuestionModel.create({ userId: user.id, questionId: params.id, scoredPoint: user.totalScore });

      // console.log(userQuestion);
      await user.save();

      return NextResponse.json(
        { success: true, message: "Your Flag Is Right!" },
        { status: HttpStatusCode.Created }
      );

    }

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}