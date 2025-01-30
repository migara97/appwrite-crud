import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

interface Interpretation {
    term: string;
    interpretation: string;
}

async function createInterpretation(data: Interpretation) {
    try {
        const response = await database.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
            ID.unique(),
            { ...data } // Ensure it's a valid JSON object
        );

        return response;
    } catch (error) {
        console.error("Error creating interpretation:", error);
        throw new Error("Failed to create interpretation");
    }
}

async function fetchInterpretation() {
    try {
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
            [Query.orderDesc("$createdAt")]
        );

        return response.documents;
    } catch (error) {
        console.error("Error fetching interpretations:", error);
        throw new Error("Failed to fetch interpretations");
    }
}

export async function POST(req: Request) {
    try {
        const { term, interpretation } = await req.json();
        const data = { term, interpretation };
        const response = await createInterpretation(data);

        return NextResponse.json({
            message: "Interpretation created",
            data: response,
        });
    } catch (_error) {
        return NextResponse.json(
            { error: "Failed to create interpretation" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const interpretations = await fetchInterpretation();
        return NextResponse.json(interpretations);
    } catch (_error) {
        return NextResponse.json(
            { error: "Failed to fetch interpretations" },
            { status: 500 }
        );
    }
}
