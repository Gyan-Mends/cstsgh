import { type ActionFunction, type LoaderFunction } from "react-router";
import Report from "~/model/reports";

// Helper function to add CORS headers
const addCorsHeaders = (response: Response): Response => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};

// Helper function to convert file to base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  // Handle OPTIONS request for CORS preflight
  if (request.method === "OPTIONS") {
    const response = new Response(null, { status: 200 });
    return addCorsHeaders(response);
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const category = url.searchParams.get("category");
    const isPublished = url.searchParams.get("isPublished");
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (id) {
      const report = await Report.findById(id);
      if (!report) {
        const response = Response.json({ success: false, message: "Report not found" }, { status: 404 });
        return addCorsHeaders(response);
      }
      const response = Response.json({ success: true, data: report });
      return addCorsHeaders(response);
    }

    // Build query filter
    const filter: any = {};
    if (category) filter.category = category;
    if (isPublished !== null && isPublished !== undefined) {
      filter.isPublished = isPublished === 'true';
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await Report.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Get reports with pagination and sorting
    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const response = Response.json({
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
    return addCorsHeaders(response);
  } catch (error: any) {
    console.error("Error fetching reports:", error);
    const response = Response.json({ success: false, message: "Failed to fetch reports" }, { status: 500 });
    return addCorsHeaders(response);
  }
};

export const action: ActionFunction = async ({ request }) => {
  // Handle OPTIONS request for CORS preflight
  if (request.method === "OPTIONS") {
    const response = new Response(null, { status: 200 });
    return addCorsHeaders(response);
  }

  try {
    const method = request.method;

    switch (method) {
      case "POST": {
        const body = await request.json();
        
        // Validate required fields
        if (!body.title || !body.description || !body.category || !body.eventDate) {
          const response = Response.json({ 
            success: false, 
            message: "Title, description, category, and event date are required" 
          }, { status: 400 });
          return addCorsHeaders(response);
        }

        const reportData: any = {
          title: body.title,
          description: body.description,
          category: body.category,
          eventDate: new Date(body.eventDate),
          eventLocation: body.eventLocation || "",
          eventOrganizer: body.eventOrganizer || "",
          summary: body.summary || "",
          isPublished: body.isPublished || false,
          tags: body.tags ? body.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [],
          keyOutcomes: body.keyOutcomes ? body.keyOutcomes.split(',').map((outcome: string) => outcome.trim()).filter((outcome: string) => outcome) : []
        };

        // Handle file data if provided
        if (body.file && body.filename) {
          reportData.filename = body.filename;
          reportData.fileUrl = body.file;
          reportData.fileSize = body.fileSize || 0;
          reportData.filePath = `reports/${Date.now()}_${body.filename}`;
        }

        const newReport = new Report(reportData);
        const savedReport = await newReport.save();
        
        const response = Response.json({ success: true, message: "Report created successfully", data: savedReport });
        return addCorsHeaders(response);
      }

      case "PUT": {
        const body = await request.json();
        const { id, ...updateFields } = body;
        
        // Validate required fields
        if (!updateFields.title || !updateFields.description || !updateFields.category || !updateFields.eventDate) {
          const response = Response.json({ 
            success: false, 
            message: "Title, description, category, and event date are required" 
          }, { status: 400 });
          return addCorsHeaders(response);
        }

        const updateData: any = {
          title: updateFields.title,
          description: updateFields.description,
          category: updateFields.category,
          eventDate: new Date(updateFields.eventDate),
          eventLocation: updateFields.eventLocation || "",
          eventOrganizer: updateFields.eventOrganizer || "",
          summary: updateFields.summary || "",
          isPublished: updateFields.isPublished || false,
          tags: updateFields.tags ? updateFields.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [],
          keyOutcomes: updateFields.keyOutcomes ? updateFields.keyOutcomes.split(',').map((outcome: string) => outcome.trim()).filter((outcome: string) => outcome) : []
        };

        // Handle file data if provided
        if (updateFields.file && updateFields.filename) {
          updateData.filename = updateFields.filename;
          updateData.fileUrl = updateFields.file;
          updateData.fileSize = updateFields.fileSize || 0;
          updateData.filePath = `reports/${Date.now()}_${updateFields.filename}`;
        }

        const updatedReport = await Report.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedReport) {
          const response = Response.json({ success: false, message: "Report not found" }, { status: 404 });
          return addCorsHeaders(response);
        }

        const response = Response.json({ success: true, message: "Report updated successfully", data: updatedReport });
        return addCorsHeaders(response);
      }

      case "DELETE": {
        const body = await request.json();
        const id = body.id;
        const deletedReport = await Report.findByIdAndDelete(id);
        
        if (!deletedReport) {
          const response = Response.json({ success: false, message: "Report not found" }, { status: 404 });
          return addCorsHeaders(response);
        }

        const response = Response.json({ success: true, message: "Report deleted successfully" });
        return addCorsHeaders(response);
      }

      default:
        const response = Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
        return addCorsHeaders(response);
    }
  } catch (error: any) {
    console.error("Error in reports API:", error);
    const response = Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
    return addCorsHeaders(response);
  }
}; 
