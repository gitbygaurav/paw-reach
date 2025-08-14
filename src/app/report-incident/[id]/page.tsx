"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/app/utils/api";
import ImageUploader from "../../_components/ImageUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const quotes = [
  "Every act of kindness towards animals helps create a better world.",
  "Saving one animal may not change the world, but it changes the world for that one animal.",
  "The love for animals is a universal impulse, a common ground on which all can meet.",
  "Be the person your pet thinks you are - kind, caring, and compassionate.",
];

const formSchema = z.object({
  location: z.string().min(1, "Location is required"),
  problemType: z.string().min(1, "Problem type is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  contactInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ReportIncident: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [location, setLocation] = useState("");
  const [locationCords, setLocationCords] = useState<[number, number] | null>(
    null
  );
  const [problemType, setProblemType] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [contactInfo, setContactInfo] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      problemType: "",
      description: "",
      contactInfo: "",
    },
  });

  const handleAutoDetectLocation = () => {
    setIsDetectingLocation(true);
    
    if (!navigator.geolocation) {
      form.setError("location", {
        message: "Geolocation is not supported by this browser.",
      });
      setIsDetectingLocation(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds timeout
      maximumAge: 300000, // Accept cached position up to 5 minutes old
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationCords([latitude, longitude]);
        
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=2a746a0ddbd94c3a9eef0823539c7c1a`
          );
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            const address = data.results[0].formatted;
            setLocation(address);
            form.setValue("location", address, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          } else {
            form.setError("location", {
              message: "Unable to retrieve address from coordinates.",
            });
          }
        } catch (error) {
          form.setError("location", {
            message: "Error fetching address. Please enter manually.",
          });
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        let errorMessage = "Location detection failed. ";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please enable location permissions in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable. Please enter manually.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out. Please try again or enter manually.";
            break;
          default:
            errorMessage += "Please enter location manually.";
            break;
        }
        
        form.setError("location", { message: errorMessage });
        setIsDetectingLocation(false);
      },
      options
    );
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setSubmissionStatus("Submitting your report...");

    const formData = {
      ngoId: id,
      location: locationCords,
      problemType: data.problemType,
      description: data.description,
      contactInfo: data.contactInfo,
      photoUrl,
    };

    try {
      const response = await fetch(`${api}/report-incident`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus("Report submitted successfully");
        setIsSuccess(true);
      } else {
        setSubmissionStatus("Failed to submit report. Please try again later.");
        console.log("Error response:", await response.json());
      }
    } catch (error) {
      setSubmissionStatus("Failed to submit report. Please try again later.");
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setIsSuccess(false);
    form.reset();          // clears field values & errors
    setLocationCords(null);
    setPhotoUrl("");
    setSubmissionStatus("");
    router.back();
  };

  return (
    <div className="bg-gray-100 px-5 pt-28 pb-5 relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
            <div className="loader h-12 w-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin mb-4 border-t-blue-500"></div>
            <p className="text-lg font-medium text-gray-700">
              Submitting your report...
            </p>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h3>
            <p className="text-gray-600 mb-6 italic">
              "{quotes[Math.floor(Math.random() * quotes.length)]}"
            </p>
            <button
              onClick={handleContinue}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Incident Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Location*</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAutoDetectLocation}
                        disabled={isDetectingLocation}
                      >
                        {isDetectingLocation ? "Detecting..." : "Auto-detect Location"}
                      </Button>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Enter location"
                        {...field}
                        value={location || field.value}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="problemType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Problem*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type of problem" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Injury">Injury</SelectItem>
                        <SelectItem value="Stray Animal">Stray Animal</SelectItem>
                        <SelectItem value="Lost Pet">Lost Pet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the incident"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Upload Photos</FormLabel>
                <ImageUploader onUploadComplete={(url) => setPhotoUrl(url)} />
              </FormItem>

              <FormField
                control={form.control}
                name="contactInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reporter's Contact No.</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your contact information"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit Report
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {submissionStatus && (
        <p className="mt-4 text-center text-sm text-red-600">
          {submissionStatus}
        </p>
      )}
    </div>
  );
};

export default ReportIncident;
