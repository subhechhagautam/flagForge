import { Types } from "mongoose";
import { HTMLProps, ReactNode } from "react";

export interface NavbarItems {
  href: string;
  tags: string;
  onClick?: () => void;
  style: HTMLProps<HTMLElement>["className"];
}

export interface GoogleProviderConfig {
  clientId: string;
  clientSecret: string;
}

export interface AuthProviderProps {
  children: ReactNode;
}


export interface Users {
  email: string;
  image?: string;
  name?: string;
  questionsDone?: string[];
  totalScore?: number;
  role?: string;
}

export interface Questions {
  title: string;
  description: string;
  category: string;
  points: number;
  flag?: string;
  isSolved?: boolean;
  addilinks?: string;
  done: any;
  _id?: string;
  link?: string;
  // answeredCorrectly: { type: Boolean; default: false };
}

export interface UserQuestion {
  userId: Types.ObjectId,
  questionId: Types.ObjectId,
  scoredPoint: number,
  _id?: string;
}