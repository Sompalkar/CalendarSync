"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Trash2, X } from "lucide-react";
import { useCalendarStore } from "@/store/calendar-store";
import type { Event } from "@/store/calendar-store";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  selectedEvent: Event | null;
}

export function EventModal({
  isOpen,
  onClose,
  selectedDate,
  selectedEvent,
}: EventModalProps) {
  const { addEvent, updateEvent, deleteEvent } = useCalendarStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    calendar: "primary",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!selectedEvent;

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title || "",
        description: selectedEvent.extendedProps?.description || "",
        startDate: selectedEvent.start?.split("T")[0] || "",
        startTime: selectedEvent.start?.split("T")[1]?.slice(0, 5) || "",
        endDate: selectedEvent.end?.split("T")[0] || "",
        endTime: selectedEvent.end?.split("T")[1]?.slice(0, 5) || "",
        location: selectedEvent.extendedProps?.location || "",
        calendar: "primary",
      });
    } else if (selectedDate) {
      setFormData({
        title: "",
        description: "",
        startDate: selectedDate,
        startTime: "09:00",
        endDate: selectedDate,
        endTime: "10:00",
        location: "",
        calendar: "primary",
      });
    }
    setFormError(null);
  }, [selectedEvent, selectedDate, isOpen]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      setFormError("Event title is required");
      return false;
    }
    if (
      !formData.startDate ||
      !formData.startTime ||
      !formData.endDate ||
      !formData.endTime
    ) {
      setFormError("Start and end date/time are required");
      return false;
    }
    const start = new Date(`${formData.startDate}T${formData.startTime}:00Z`);
    const end = new Date(`${formData.endDate}T${formData.endTime}:00Z`);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setFormError("Invalid date or time format");
      return false;
    }
    if (start >= end) {
      setFormError("End time must be after start time");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const eventData = {
      ...formData,
      start: `${formData.startDate}T${formData.startTime}`,
      end: `${formData.endDate}T${formData.endTime}`,
    };

    try {
      if (isEditing) {
        await updateEvent(selectedEvent?.id || "", eventData);
      } else {
        await addEvent(eventData);
      }
      onClose();
    } catch (error) {
      setFormError("Failed to save event. Please try again.");
      console.error("Error saving event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      setIsSubmitting(true);
      try {
        await deleteEvent(selectedEvent.id);
        onClose();
      } catch (error) {
        console.error("Error deleting event:", error);
        setFormError("Failed to delete event");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 gap-0 border-neutral-200">
        <DialogHeader className="px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2 text-lg">
              <Calendar className="h-4 w-4 text-neutral-600" />
              <span>{isEditing ? "Edit Event" : "New Event"}</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-3 py-2 text-sm">
              {formError}
            </div>
          )}

          <div className="space-y-1.5">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-neutral-700"
            >
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Event title"
              className="h-9 border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="startDate"
                className="text-sm font-medium text-neutral-700"
              >
                Start
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="h-9 border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="startTime"
                className="text-sm font-medium text-neutral-700"
              >
                Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="h-9 border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="endDate"
                className="text-sm font-medium text-neutral-700"
              >
                End
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="h-9 border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="endTime"
                className="text-sm font-medium text-neutral-700"
              >
                Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="h-9 border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="location"
              className="text-sm font-medium text-neutral-700"
            >
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Add location"
                className="h-9 pl-10 border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-neutral-700"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add description"
              rows={2}
              className="border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="calendar"
              className="text-sm font-medium text-neutral-700"
            >
              Calendar
            </Label>
            <Select
              value={formData.calendar}
              onValueChange={(value) =>
                setFormData({ ...formData, calendar: value })
              }
            >
              <SelectTrigger className="h-9 border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400">
                <SelectValue placeholder="Select calendar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Personal</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 bg-neutral-50">
          <div>
            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-3"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-8 px-3"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-neutral-900 hover:bg-neutral-800 h-8 px-4"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
