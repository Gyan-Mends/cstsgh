import { type ActionFunction, type LoaderFunction } from "react-router";
import Event from "~/model/events";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const event = await Event.findById(id);
      if (!event) {
        return Response.json({ success: false, message: "Event not found" }, { status: 404 });
      }
      return Response.json({ success: true, data: event });
    }

    const events = await Event.find().sort({ createdAt: -1 });
    return Response.json({ success: true, data: events });
  } catch (error) {
    return Response.json({ success: false, message: "Failed to fetch events" }, { status: 500 });
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
        const eventData = {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          date: formData.get("date") as string,
          location: formData.get("location") as string,
          image: formData.get("image") as string,
        };

        const newEvent = new Event(eventData);
        await newEvent.save();
        
        return Response.json({ success: true, message: "Event created successfully", data: newEvent });
      }

      case "PUT": {
        const id = formData.get("id") as string;
        const updateData = {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          date: formData.get("date") as string,
          location: formData.get("location") as string,
          image: formData.get("image") as string,
        };

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedEvent) {
          return Response.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Event updated successfully", data: updatedEvent });
      }

      case "DELETE": {
        const id = formData.get("id") as string;
        const deletedEvent = await Event.findByIdAndDelete(id);
        
        if (!deletedEvent) {
          return Response.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Event deleted successfully" });
      }

      default:
        return Response.json({ success: false, message: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    return Response.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}; 