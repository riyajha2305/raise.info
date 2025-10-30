"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import SalaryDetailsPanel from "@/components/SalaryDetailsPanel";

interface InternshipData {
  company_name: string;
  role: string;
  location: string;
  duration: string;
  stipend_min: number;
  stipend_max: number;
  stipend_avg: number;
  reports: number;
  university: string;
  year: number;
}

interface Filters {
  companyName: string;
  role: string;
  location: string;
  duration: string;
  university: string;
  year: string;
  stipendMin: number;
  stipendMax: number;
}

type SortField = keyof InternshipData;
type SortDirection = "asc" | "desc";

export default function InternshipsPage() {
  // Sample internship data
  const internshipData: InternshipData[] = [
    {
      company_name: "Google",
      role: "Software Engineering Intern",
      location: "Mountain View, CA",
      duration: "12 weeks",
      stipend_min: 6000,
      stipend_max: 8000,
      stipend_avg: 7000,
      reports: 45,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Microsoft",
      role: "Product Management Intern",
      location: "Seattle, WA",
      duration: "10 weeks",
      stipend_min: 5500,
      stipend_max: 7500,
      stipend_avg: 6500,
      reports: 32,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Amazon",
      role: "Data Science Intern",
      location: "Seattle, WA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 28,
      university: "MIT",
      year: 2024,
    },
    {
      company_name: "Meta",
      role: "Frontend Development Intern",
      location: "Menlo Park, CA",
      duration: "12 weeks",
      stipend_min: 5800,
      stipend_max: 7800,
      stipend_avg: 6800,
      reports: 41,
      university: "Carnegie Mellon",
      year: 2024,
    },
    {
      company_name: "Apple",
      role: "iOS Development Intern",
      location: "Cupertino, CA",
      duration: "12 weeks",
      stipend_min: 6200,
      stipend_max: 8200,
      stipend_avg: 7200,
      reports: 35,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Netflix",
      role: "Backend Engineering Intern",
      location: "Los Gatos, CA",
      duration: "10 weeks",
      stipend_min: 5500,
      stipend_max: 7500,
      stipend_avg: 6500,
      reports: 22,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Uber",
      role: "Machine Learning Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 19,
      university: "MIT",
      year: 2024,
    },
    {
      company_name: "Airbnb",
      role: "UX Design Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 4800,
      stipend_max: 6800,
      stipend_avg: 5800,
      reports: 15,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Tesla",
      role: "Software Engineering Intern",
      location: "Palo Alto, CA",
      duration: "12 weeks",
      stipend_min: 6000,
      stipend_max: 8000,
      stipend_avg: 7000,
      reports: 38,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "SpaceX",
      role: "Aerospace Engineering Intern",
      location: "Hawthorne, CA",
      duration: "16 weeks",
      stipend_min: 5500,
      stipend_max: 7500,
      stipend_avg: 6500,
      reports: 25,
      university: "Caltech",
      year: 2024,
    },
    {
      company_name: "Salesforce",
      role: "Sales Engineering Intern",
      location: "San Francisco, CA",
      duration: "10 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 42,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Oracle",
      role: "Database Engineering Intern",
      location: "Redwood City, CA",
      duration: "12 weeks",
      stipend_min: 4800,
      stipend_max: 6800,
      stipend_avg: 5800,
      reports: 31,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Adobe",
      role: "Product Design Intern",
      location: "San Jose, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 28,
      university: "Carnegie Mellon",
      year: 2024,
    },
    {
      company_name: "Intel",
      role: "Hardware Engineering Intern",
      location: "Santa Clara, CA",
      duration: "12 weeks",
      stipend_min: 4500,
      stipend_max: 6500,
      stipend_avg: 5500,
      reports: 35,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "NVIDIA",
      role: "GPU Engineering Intern",
      location: "Santa Clara, CA",
      duration: "12 weeks",
      stipend_min: 5800,
      stipend_max: 7800,
      stipend_avg: 6800,
      reports: 29,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "PayPal",
      role: "Fintech Engineering Intern",
      location: "San Jose, CA",
      duration: "10 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 24,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "LinkedIn",
      role: "Data Engineering Intern",
      location: "Sunnyvale, CA",
      duration: "12 weeks",
      stipend_min: 5500,
      stipend_max: 7500,
      stipend_avg: 6500,
      reports: 33,
      university: "MIT",
      year: 2024,
    },
    {
      company_name: "Twitter",
      role: "Backend Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 18,
      university: "Carnegie Mellon",
      year: 2024,
    },
    {
      company_name: "Snapchat",
      role: "Mobile Development Intern",
      location: "Santa Monica, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 21,
      university: "UCLA",
      year: 2024,
    },
    {
      company_name: "Pinterest",
      role: "Frontend Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 4800,
      stipend_max: 6800,
      stipend_avg: 5800,
      reports: 16,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Dropbox",
      role: "Cloud Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 19,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Slack",
      role: "Product Management Intern",
      location: "San Francisco, CA",
      duration: "10 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 22,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Zoom",
      role: "Video Engineering Intern",
      location: "San Jose, CA",
      duration: "12 weeks",
      stipend_min: 4800,
      stipend_max: 6800,
      stipend_avg: 5800,
      reports: 26,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Palantir",
      role: "Data Science Intern",
      location: "Palo Alto, CA",
      duration: "12 weeks",
      stipend_min: 6000,
      stipend_max: 8000,
      stipend_avg: 7000,
      reports: 14,
      university: "MIT",
      year: 2024,
    },
    {
      company_name: "Stripe",
      role: "Payment Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5500,
      stipend_max: 7500,
      stipend_avg: 6500,
      reports: 17,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Coinbase",
      role: "Blockchain Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 20,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Robinhood",
      role: "Trading Engineering Intern",
      location: "Menlo Park, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 23,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "DoorDash",
      role: "Logistics Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 4800,
      stipend_max: 6800,
      stipend_avg: 5800,
      reports: 27,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Uber Eats",
      role: "Delivery Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 25,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Lyft",
      role: "Mobility Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 4800,
      stipend_max: 6800,
      stipend_avg: 5800,
      reports: 21,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "GitHub",
      role: "Developer Tools Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 18,
      university: "MIT",
      year: 2024,
    },
    {
      company_name: "Atlassian",
      role: "Product Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 24,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "MongoDB",
      role: "Database Engineering Intern",
      location: "New York, NY",
      duration: "12 weeks",
      stipend_min: 4800,
      stipend_max: 6800,
      stipend_avg: 5800,
      reports: 19,
      university: "Columbia University",
      year: 2024,
    },
    {
      company_name: "Reddit",
      role: "Community Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 16,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Discord",
      role: "Real-time Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 22,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Twitch",
      role: "Streaming Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 20,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Spotify",
      role: "Audio Engineering Intern",
      location: "New York, NY",
      duration: "12 weeks",
      stipend_min: 4800,
      stipend_max: 6800,
      stipend_avg: 5800,
      reports: 28,
      university: "NYU",
      year: 2024,
    },
    {
      company_name: "Shopify",
      role: "E-commerce Engineering Intern",
      location: "Ottawa, Canada",
      duration: "16 weeks",
      stipend_min: 4500,
      stipend_max: 6500,
      stipend_avg: 5500,
      reports: 31,
      university: "University of Toronto",
      year: 2024,
    },
    {
      company_name: "Square",
      role: "Payment Processing Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 25,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Airbnb",
      role: "Backend Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 23,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Google",
      role: "Machine Learning Intern",
      location: "Mountain View, CA",
      duration: "12 weeks",
      stipend_min: 6500,
      stipend_max: 8500,
      stipend_avg: 7500,
      reports: 52,
      university: "MIT",
      year: 2024,
    },
    {
      company_name: "Microsoft",
      role: "Cloud Engineering Intern",
      location: "Seattle, WA",
      duration: "12 weeks",
      stipend_min: 5800,
      stipend_max: 7800,
      stipend_avg: 6800,
      reports: 45,
      university: "University of Washington",
      year: 2024,
    },
    {
      company_name: "Amazon",
      role: "AWS Engineering Intern",
      location: "Seattle, WA",
      duration: "12 weeks",
      stipend_min: 5500,
      stipend_max: 7500,
      stipend_avg: 6500,
      reports: 38,
      university: "University of Washington",
      year: 2024,
    },
    {
      company_name: "Meta",
      role: "VR/AR Engineering Intern",
      location: "Menlo Park, CA",
      duration: "12 weeks",
      stipend_min: 6000,
      stipend_max: 8000,
      stipend_avg: 7000,
      reports: 29,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Apple",
      role: "Hardware Engineering Intern",
      location: "Cupertino, CA",
      duration: "12 weeks",
      stipend_min: 6200,
      stipend_max: 8200,
      stipend_avg: 7200,
      reports: 41,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Netflix",
      role: "Content Engineering Intern",
      location: "Los Gatos, CA",
      duration: "12 weeks",
      stipend_min: 5500,
      stipend_max: 7500,
      stipend_avg: 6500,
      reports: 26,
      university: "UCLA",
      year: 2024,
    },
    {
      company_name: "Uber",
      role: "Autonomous Vehicle Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 6000,
      stipend_max: 8000,
      stipend_avg: 7000,
      reports: 19,
      university: "Carnegie Mellon",
      year: 2024,
    },
    {
      company_name: "Tesla",
      role: "Autopilot Engineering Intern",
      location: "Palo Alto, CA",
      duration: "12 weeks",
      stipend_min: 6500,
      stipend_max: 8500,
      stipend_avg: 7500,
      reports: 22,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "SpaceX",
      role: "Software Engineering Intern",
      location: "Hawthorne, CA",
      duration: "16 weeks",
      stipend_min: 6000,
      stipend_max: 8000,
      stipend_avg: 7000,
      reports: 18,
      university: "Caltech",
      year: 2024,
    },
    {
      company_name: "Salesforce",
      role: "CRM Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 35,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Oracle",
      role: "Cloud Engineering Intern",
      location: "Redwood City, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 28,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Adobe",
      role: "Creative Cloud Intern",
      location: "San Jose, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 32,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Intel",
      role: "AI Engineering Intern",
      location: "Santa Clara, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 30,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "NVIDIA",
      role: "AI Research Intern",
      location: "Santa Clara, CA",
      duration: "12 weeks",
      stipend_min: 6000,
      stipend_max: 8000,
      stipend_avg: 7000,
      reports: 24,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "PayPal",
      role: "Security Engineering Intern",
      location: "San Jose, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 27,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "LinkedIn",
      role: "Social Engineering Intern",
      location: "Sunnyvale, CA",
      duration: "12 weeks",
      stipend_min: 5500,
      stipend_max: 7500,
      stipend_avg: 6500,
      reports: 36,
      university: "MIT",
      year: 2024,
    },
    {
      company_name: "Twitter",
      role: "Social Media Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 20,
      university: "Carnegie Mellon",
      year: 2024,
    },
    {
      company_name: "Snapchat",
      role: "AR Engineering Intern",
      location: "Santa Monica, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 23,
      university: "UCLA",
      year: 2024,
    },
    {
      company_name: "Pinterest",
      role: "Visual Search Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 19,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Dropbox",
      role: "File Storage Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 21,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Slack",
      role: "Communication Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 25,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Zoom",
      role: "Video Conferencing Intern",
      location: "San Jose, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 28,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Palantir",
      role: "Data Analytics Intern",
      location: "Palo Alto, CA",
      duration: "12 weeks",
      stipend_min: 6000,
      stipend_max: 8000,
      stipend_avg: 7000,
      reports: 16,
      university: "MIT",
      year: 2024,
    },
    {
      company_name: "Stripe",
      role: "Financial Technology Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5500,
      stipend_max: 7500,
      stipend_avg: 6500,
      reports: 20,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Coinbase",
      role: "Cryptocurrency Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5500,
      stipend_max: 7500,
      stipend_avg: 6500,
      reports: 24,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Robinhood",
      role: "Financial Services Intern",
      location: "Menlo Park, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 26,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "DoorDash",
      role: "Food Delivery Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 29,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Uber Eats",
      role: "Food Tech Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 27,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Lyft",
      role: "Transportation Engineering Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 23,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "GitHub",
      role: "Developer Platform Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 20,
      university: "MIT",
      year: 2024,
    },
    {
      company_name: "Atlassian",
      role: "Collaboration Tools Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 26,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "MongoDB",
      role: "NoSQL Engineering Intern",
      location: "New York, NY",
      duration: "12 weeks",
      stipend_min: 4800,
      stipend_max: 6800,
      stipend_avg: 5800,
      reports: 22,
      university: "Columbia University",
      year: 2024,
    },
    {
      company_name: "Reddit",
      role: "Community Platform Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 18,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Discord",
      role: "Gaming Communication Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5200,
      stipend_max: 7200,
      stipend_avg: 6200,
      reports: 24,
      university: "UC Berkeley",
      year: 2024,
    },
    {
      company_name: "Twitch",
      role: "Live Streaming Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 22,
      university: "Stanford University",
      year: 2024,
    },
    {
      company_name: "Spotify",
      role: "Music Streaming Intern",
      location: "New York, NY",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 30,
      university: "NYU",
      year: 2024,
    },
    {
      company_name: "Shopify",
      role: "E-commerce Platform Intern",
      location: "Ottawa, Canada",
      duration: "16 weeks",
      stipend_min: 4500,
      stipend_max: 6500,
      stipend_avg: 5500,
      reports: 33,
      university: "University of Toronto",
      year: 2024,
    },
    {
      company_name: "Square",
      role: "Point of Sale Intern",
      location: "San Francisco, CA",
      duration: "12 weeks",
      stipend_min: 5000,
      stipend_max: 7000,
      stipend_avg: 6000,
      reports: 27,
      university: "UC Berkeley",
      year: 2024,
    },
  ];

  // Calculate stipend range from data
  const stipendRange = useMemo(() => {
    const allStipends = internshipData.map((item) => item.stipend_avg);
    return {
      min: Math.floor(Math.min(...allStipends)),
      max: Math.ceil(Math.max(...allStipends)),
    };
  }, []);

  const [filters, setFilters] = useState<Filters>({
    companyName: "",
    role: "",
    location: "",
    duration: "",
    university: "",
    year: "",
    stipendMin: 0,
    stipendMax: 10000,
  });

  const [sortField, setSortField] = useState<SortField>("stipend_avg");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState<string[]>([]);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Side panel state - open by default for first row
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [selectedInternshipData, setSelectedInternshipData] = useState<InternshipData | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); // Track selected row index

  // Handle row click to open side panel
  const handleRowClick = (item: InternshipData, index: number) => {
    setSelectedInternshipData(item);
    setSelectedRowIndex(index);
    setIsSidePanelOpen(true);
  };

  // Handle side panel close
  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false);
    setSelectedInternshipData(null);
  };


  // Handle company name autocomplete
  const handleCompanyNameChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      companyName: value,
    }));

    if (value) {
      const filtered = uniqueCompanies.filter((company) =>
        company.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCompanies(filtered);
      setShowAutocomplete(filtered.length > 0);
    } else {
      setShowAutocomplete(false);
    }
    setCurrentPage(1);
  };

  const handleCompanySelect = (company: string) => {
    setFilters((prev) => ({
      ...prev,
      companyName: company,
    }));
    setShowAutocomplete(false);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      companyName: "",
      role: "",
      location: "",
      duration: "",
      university: "",
      year: "",
      stipendMin: stipendRange.min,
      stipendMax: stipendRange.max,
    });
    setCurrentPage(1);
  };

  // Handle stipend range change
  const handleStipendRangeChange = (value: number | number[]) => {
    const values = Array.isArray(value) ? value : [value, value];
    setFilters((prev) => ({
      ...prev,
      stipendMin: values[0],
      stipendMax: values[1],
    }));
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = internshipData.filter((item) => {
      return (
        (filters.companyName === "" ||
          item.company_name
            .toLowerCase()
            .includes(filters.companyName.toLowerCase())) &&
        (filters.role === "" ||
          item.role.toLowerCase().includes(filters.role.toLowerCase())) &&
        (filters.location === "" ||
          item.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (filters.duration === "" || item.duration === filters.duration) &&
        (filters.university === "" ||
          item.university.toLowerCase().includes(filters.university.toLowerCase())) &&
        (filters.year === "" || item.year.toString() === filters.year) &&
        (item.stipend_avg >= filters.stipendMin && item.stipend_avg <= filters.stipendMax)
      );
    });

    // Sort the data
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [filters, sortField, sortDirection]);

  // Set first row as selected by default when component mounts
  useEffect(() => {
    if (filteredAndSortedData.length > 0 && !selectedInternshipData) {
      setSelectedInternshipData(filteredAndSortedData[0]);
      setSelectedRowIndex(0);
    }
  }, [filteredAndSortedData, selectedInternshipData]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  const uniqueCompanies = useMemo(
    () => [...new Set(internshipData.map((item) => item.company_name))].sort(),
    []
  );

  const uniqueRoles = useMemo(
    () => [...new Set(internshipData.map((item) => item.role))].sort(),
    []
  );

  const uniqueLocations = useMemo(
    () => [...new Set(internshipData.map((item) => item.location))].sort(),
    []
  );

  const uniqueDurations = useMemo(
    () => [...new Set(internshipData.map((item) => item.duration))].sort(),
    []
  );

  const uniqueUniversities = useMemo(
    () => [...new Set(internshipData.map((item) => item.university))].sort(),
    []
  );

  const uniqueYears = useMemo(
    () => [...new Set(internshipData.map((item) => item.year))].sort((a, b) => b - a),
    []
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  // Sort icon component - consistent icon that doesn't change
  const SortIcon = ({ field }: { field: SortField }) => {
    const isActive = sortField === field;
    return (
      <div className="flex flex-col items-center justify-center w-4 h-4">
        <svg
          className={`w-3 h-3 transition-colors ${isActive
              ? "text-slate-600"
              : "text-gray-400 group-hover:text-gray-600"
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
        {isActive && (
          <div
            className={`text-xs font-bold ${sortDirection === "asc" ? "text-slate-600" : "text-slate-600"
              }`}
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-200 to-slate-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-700 mb-4">
              Internships That Pay Big
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Real stipend data from top companies.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Filter Internships</h3>
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Company Name with Autocomplete */}
            <div className="relative" ref={autocompleteRef}>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Company
              </label>
              <input
                type="text"
                placeholder="Search company..."
                value={filters.companyName}
                onChange={(e) => handleCompanyNameChange(e.target.value)}
                onFocus={() =>
                  filters.companyName &&
                  setShowAutocomplete(filteredCompanies.length > 0)
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-colors"
              />
              {showAutocomplete && filteredCompanies.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company}
                      className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer transition-colors text-gray-900 border-b border-gray-100 last:border-b-0"
                      onClick={() => handleCompanySelect(company)}
                    >
                      {company}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 bg-white transition-colors"
              >
                <option value="">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 bg-white transition-colors"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Duration
              </label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange("duration", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 bg-white transition-colors"
              >
                <option value="">All Durations</option>
                {uniqueDurations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>

            {/* University */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                University
              </label>
              <select
                value={filters.university}
                onChange={(e) => handleFilterChange("university", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 bg-white transition-colors"
              >
                <option value="">All Universities</option>
                {uniqueUniversities.map((university) => (
                  <option key={university} value={university}>
                    {university}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 bg-white transition-colors"
              >
                <option value="">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stipend Range Slider */}
          <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                <span className="text-slate-700 text-sm font-semibold">Rs</span>
              </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Total Stipend Range</h4>
                  <p className="text-xs text-gray-600">Filter by monthly total stipend</p>
                </div>
              </div>
            
            </div>

            <div className="px-2">
              <Slider
                range
                min={stipendRange.min}
                max={stipendRange.max}
                value={[filters.stipendMin, filters.stipendMax]}
                onChange={handleStipendRangeChange}
                trackStyle={[{ backgroundColor: "#64748b", height: 6 }]}
                handleStyle={[
                  { backgroundColor: "#64748b", borderColor: "#64748b", width: 20, height: 20, marginTop: -7, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
                  { backgroundColor: "#64748b", borderColor: "#64748b", width: 20, height: 20, marginTop: -7, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
                ]}
                railStyle={{ backgroundColor: "#e2e8f0", height: 6 }}
              />
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>Min: {formatCurrency(stipendRange.min)}</span>
                <span>Max: {formatCurrency(stipendRange.max)}</span>
              </div>
            </div>
          </div>

          
        </div>
      </div>

      {/* Results Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Table and Side Panel Container */}
        <div className={`flex gap-4 transition-all duration-500 ease-in-out min-h-[600px] ${isSidePanelOpen ? '' : ''}`}>
          {/* Table Section - 70% when panel is open, 100% when closed */}
          <div className={`transition-all duration-500 ease-in-out flex flex-col ${isSidePanelOpen ? 'w-[70%]' : 'w-full'}`}>
            {filteredAndSortedData.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                <svg
                  className="mx-auto h-16 w-16 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-neutral-600 text-xl font-semibold mt-6">No results found</div>
                <p className="text-neutral-500 mt-2">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 flex-1 flex flex-col">
                  <div className="overflow-x-auto flex-1 flex flex-col">
                    <table className="min-w-full divide-y divide-gray-200 flex-1">
                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0">
                      <tr>
                        <th
                          className="group px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors select-none w-48"
                          onClick={() => handleSort("company_name")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">Company</span>
                            <SortIcon field="company_name" />
                          </div>
                        </th>
                        <th
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-40"
                          onClick={() => handleSort("role")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">Role</span>
                            <SortIcon field="role" />
                          </div>
                        </th>
                        <th
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                          onClick={() => handleSort("location")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">Location</span>
                            <SortIcon field="location" />
                          </div>
                        </th>
                        <th
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-20"
                          onClick={() => handleSort("duration")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">Duration</span>
                            <SortIcon field="duration" />
                          </div>
                        </th>
                        <th
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-40"
                          onClick={() => handleSort("stipend_avg")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">Total Stipend</span>
                            <SortIcon field="stipend_avg" />
                          </div>
                        </th>
                        <th
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-40"
                          onClick={() => handleSort("university")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">University</span>
                            <SortIcon field="university" />
                          </div>
                        </th>
                        <th
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-24"
                          onClick={() => handleSort("reports")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">Reports</span>
                            <SortIcon field="reports" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentData.map((item, index) => (
                        <tr
                          key={`${item.company_name}-${item.role}-${index}`}
                          className={`hover:bg-slate-50 hover:shadow-sm transition-all duration-150 cursor-pointer ${
                            selectedRowIndex === index ? 'bg-slate-200 border-2 border-slate-300' : ''
                          }`}
                          onClick={() => handleRowClick(item, index)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {item.company_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {item.role}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {item.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {item.duration}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-slate-600">
                              {formatCurrency(item.stipend_avg)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {item.university}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {item.reports}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            )}
          </div>

          {/* Side Panel Section - 30% when open */}
          {isSidePanelOpen && (
            <SalaryDetailsPanel
              isOpen={isSidePanelOpen}
              onClose={handleCloseSidePanel}
              data={selectedInternshipData}
            />
          )}
        </div>

        {/* Pagination - Outside table/side panel container */}
        {currentData.length > 0 && totalPages > 1 && (
          <div className="max-w-7xl mx-auto pb-8 mt-8">
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-slate-600">{startIndex + 1}</span> to{" "}
                <span className="font-semibold text-slate-600">
                  {Math.min(endIndex, filteredAndSortedData.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600">
                  {filteredAndSortedData.length}
                </span>{" "}
                results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${page === currentPage
                          ? "bg-slate-500 text-white shadow-md"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-slate-50"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

