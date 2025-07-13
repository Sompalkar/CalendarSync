"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Trash2 } from "lucide-react"
import { useCalendarStore } from "@/store/calendar-store"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string | null
  selectedEvent: any
}

export function EventModal({ isOpen, onClose, selectedDate, selectedEvent }: EventModalProps) {
  const { addEvent, updateEvent, deleteEvent } = useCalendarStore()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    calendar: "primary",
    attendees: "",
  })

  const isEditing = !!selectedEvent

  useEffect(() => {
    if (selectedEvent) {
      // Populate form with event data
      setFormData({
        title: selectedEvent.title || "",
        description: selectedEvent.extendedProps?.description || "",
        startDate: selectedEvent.startStr?.split("T")[0] || "",
        startTime: selectedEvent.startStr?.split("T")[1]?.slice(0, 5) || "",
        endDate: selectedEvent.endStr?.split("T")[0] || "",
        endTime: selectedEvent.endStr?.split("T")[1]?.slice(0, 5) || "",
        location: selectedEvent.extendedProps?.location || "",
        calendar: "primary",
        attendees: "",
      })
    } else if (selectedDate) {
      // New event for selected date
      setFormData({
        title: "",
        description: "",
        startDate: selectedDate,
        startTime: "09:00",
        endDate: selectedDate,
        endTime: "10:00",
        location: "",
        calendar: "primary",
        attendees: "",
      })
    }
  }, [selectedEvent, selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const eventData = {
      ...formData,
      start: `${formData.startDate}T${formData.startTime}`,
      end: `${formData.endDate}T${formData.endTime}`,
    }

    try {
      if (isEditing) {
        await updateEvent(selectedEvent.id, eventData)
      } else {
        await addEvent(eventData)
      }
      onClose()
    } catch (error) {
      console.error("Error saving event:", error)
    }
  }

  const handleDelete = async () => {
    if (selectedEvent) {
      try {
        await deleteEvent(selectedEvent.id)
        onClose()
      } catch (error) {
        console.error("Error deleting event:", error)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>{isEditing ? "Edit Event" : "Create New Event"}</span>
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Update your event details" : "Add a new event to your calendar"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Add location"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="calendar">Calendar</Label>
            <Select value={formData.calendar} onValueChange={(value) => setFormData({ ...formData, calendar: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select calendar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Personal</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {isEditing ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
