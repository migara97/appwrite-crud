import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

interface Interpretation {
    term: string;
    interpretation: string;
}

async function fetchInterpretation(id: string) {
    try {
        const interpretation = await database.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
            id
        );

        return interpretation;
    } catch (error) {
        console.error("Error fetching interpretation:", error);
        throw new Error("Failed to fetch interpretation");
    }
}

async function deleteInterpretation(id: string) {
    try {
        const response = await database.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
            id
        );

        return response;
    } catch (error) {
        console.error("Error deleting interpretation:", error);
        throw new Error("Failed to delete interpretation");
    }
}

async function updateInterpretation(id: string, data: Interpretation) {
    try {
        const response = await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string,
            id,
            data,
        );

        return response;
    } catch (error) {
        console.error("Error deleting interpretation:", error);
        throw new Error("Failed to delete interpretation");
    }
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const interpretation = await fetchInterpretation(id);
        return NextResponse.json({ interpretation });
    } catch (_error) {
        return NextResponse.json(
            { error: "Failed to fetch interpretation" },
            { status: 500 }
        );       
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        await deleteInterpretation(id);
        return NextResponse.json({ message: "Interpretation deleted" });
    } catch (_error) {
        return NextResponse.json(
            { error: "Failed to deleted interpretation" },
            { status: 500 }
        );       
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const interpretation = await req.json();
        await updateInterpretation(id, interpretation);
        return NextResponse.json({ message: "Interpretation updated" });
    } catch (_error) {
        return NextResponse.json(
            { error: "Failed to update interpretation" },
            { status: 500 }
        );       
    }
}