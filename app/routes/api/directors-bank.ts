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
    const formData = await request.formData();
    const method = request.method;
    const _method = formData.get("_method") as string;
    
    const actionMethod = _method || method;

    switch (actionMethod) {
      case "POST": {
        const areasOfExpertise = formData.get("areasOfExpertise") as string;
        const directorData = {
          name: formData.get("name") as string,
          position: formData.get("position") as string,
          image: formData.get("image") as string,
          areasOfExpertise: areasOfExpertise ? areasOfExpertise.split(",").map(area => area.trim()) : [],
        };

        const newDirector = new DirectorsBank(directorData);
        await newDirector.save();
        
        return Response.json({ success: true, message: "Director created successfully", data: newDirector });
      }

      case "PUT": {
        const id = formData.get("id") as string;
        const areasOfExpertise = formData.get("areasOfExpertise") as string;
        const updateData = {
          name: formData.get("name") as string,
          position: formData.get("position") as string,
          image: formData.get("image") as string,
          areasOfExpertise: areasOfExpertise ? areasOfExpertise.split(",").map(area => area.trim()) : [],
        };

        const updatedDirector = await DirectorsBank.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedDirector) {
          return Response.json({ success: false, message: "Director not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Director updated successfully", data: updatedDirector });
      }

      case "DELETE": {
        const id = formData.get("id") as string;
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