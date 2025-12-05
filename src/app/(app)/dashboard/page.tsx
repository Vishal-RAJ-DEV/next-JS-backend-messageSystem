"use client";
import React from 'react'
import { useState , useEffect } from 'react'
import axios , {AxiosError} from 'axios'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import {message} from '@/model/user'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'react-toastify'

const DashboardPage = () => {
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[...new Array(4)].map((_, i) => (
          <div
            key={"stats-" + i}
            className="h-32 rounded-lg bg-gray-100 dark:bg-neutral-800 p-4 flex items-center justify-center"
          >
            <p className="text-neutral-600 dark:text-neutral-400">Stat Card {i + 1}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...new Array(2)].map((_, i) => (
          <div
            key={"content-" + i}
            className="h-64 rounded-lg bg-gray-100 dark:bg-neutral-800 p-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400">Content Area {i + 1}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage