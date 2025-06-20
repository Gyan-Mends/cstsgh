import { type ActionFunction, type LoaderFunction } from "react-router";
import DirectorsBank from "~/model/directorsBank";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const director = await DirectorsBank.findById(id);
      if (!director) {
        return Response.json({ success: false, message: "Director not found" }, { status: 404 });
      }
      return Response.json({ success: true, data: director });
    }

    const directors = await DirectorsBank.find().sort({ createdAt: -1 });
    return Response.json({ success: true, data: directors });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch directors" }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const method = request.method;

    switch (method) {
      case "POST": {
        const body = await request.json();
        const directorData = {
          name: body.name,
          position: body.position,
          bio: body.bio,
          image: body.image,
          areasOfExpertise: body.areasOfExpertise || [],
          email: body.email,
          phone: body.phone,
        };

        const newDirector = new DirectorsBank(directorData);
        await newDirector.save();
        
        return Response.json({ success: true, message: "Director created successfully", data: newDirector });
      }

      case "PUT": {
        const body = await request.json();
        const id = body.id;
        const updateData = {
          name: body.name,
          position: body.position,
          bio: body.bio,
          areasOfExpertise: body.areasOfExpertise || [],
          email: body.email,
          phone: body.phone,
          ...(body.image && { image: body.image }),
        };

        const updatedDirector = await DirectorsBank.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedDirector) {
          return Response.json({ success: false, message: "Director not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Director updated successfully", data: updatedDirector });
      }

      case "DELETE": {
        const body = await request.json();
        const id = body.id;
        const deletedDirector = await DirectorsBank.findByIdAndDelete(id);
        
        if (!deletedDirector) {
          return Response.json({ success: false, message: "Director not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Director deleted successfully" });
      }

      default:
        return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    return Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}; 