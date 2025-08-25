import { NextResponse } from "next/server";

export async function GET() {
  try {
    // For now, return mock data to prevent API errors
    const mockProperties = [
      {
        id: 1,
        address: "Westlands, Nairobi",
        coordinates: { lng: 36.8095, lat: -1.2676 },
        type: "Commercial",
        value: 50000000
      },
      {
        id: 2,
        address: "Karen, Nairobi", 
        coordinates: { lng: 36.6851, lat: -1.3192 },
        type: "Residential",
        value: 25000000
      }
    ];

    return NextResponse.json(mockProperties);
  } catch (error) {
    console.error('Properties API error:', error);
    return NextResponse.json(
      { error: "Failed to fetch properties" }, 
      { status: 500 }
    );
  }
}