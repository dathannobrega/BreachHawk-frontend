"use client"

import type React from "react"
import { useState } from "react"

const Leaks: React.FC = () => {
  const [leaks, setLeaks] = useState([
    {
      id: 1,
      site: "example.com",
      keyword: "senha123",
      source: "forum-hacker.net",
      date: "2023-05-15",
      severity: "high",
      status: "active",
    },
    {
      id: 2,
      site: "test.org",
      keyword: "api_key",
      source: "darkweb-marketplace.onion",
      date: "2023-05-14",
      severity: "medium",
      status: "active",
    },
    {
      id: 3,
      site: "demo.net",
      keyword: "admin",
      source: "pastebin.com",
      date: "2023-05-13",
      severity: "low",
      status: "resolved",
    },
    {
      id: 4,
      site: "sample.io",
      keyword: "password",
      source: "github.com",
      date: "2023-05-12",
      severity: "high",
      status: "active",
    },
    {
      id: 5,
      site: "test-site.com",
      keyword: "secret",
      source: "telegram-channel",
      date: "2023-05-11",
      severity: "medium",
      status: "resolved",
    },
    {
      id: 6,
      site: "another-example.com",
      keyword: "token",
      source: "discord-server",
      date: "2023-05-10",
      severity: "high",
      status: "active",
    },
    {
      id: 7,
      site: "yet-another.org",
      keyword: "private_key",
      source: "reddit.com",
      date: "2023-05-09",
      severity: "medium",
      status: "resolved",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selecte
