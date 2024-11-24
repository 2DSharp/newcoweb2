'use client'

import { useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { ChevronDown } from 'lucide-react'

interface Column {
    key: string
    header: string | React.ReactNode
    render?: (value: any) => React.ReactNode
    isIdentityColumn?: boolean
    isActionColumn?: boolean
}

interface ResponsiveTableProps {
    columns: Column[]
    data: any[]
    identityColumn: string
    actionColumn?: string
}

export function ResponsiveTable({ columns, data, identityColumn, actionColumn }: ResponsiveTableProps) {
    // Desktop view
    const DesktopTable = () => (
        <div className="hidden md:block overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column.key} className="text-gray-600">
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            {columns.map((column) => (
                                <TableCell key={column.key}>
                                    {column.render ? column.render(row[column.key]) : row[column.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )

    // Mobile view
    const MobileAccordion = () => (
        <div className="md:hidden">
            <Accordion type="single" collapsible className="space-y-2">
                {data.map((row, index) => (
                    <AccordionItem key={index} value={index.toString()} className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                            <div className="flex justify-between items-center w-full">
                                <div className="font-medium">
                                    {columns.find(col => col.key === identityColumn)?.render
                                        ? columns.find(col => col.key === identityColumn)?.render(row[identityColumn])
                                        : row[identityColumn]}
                                </div>
                                {actionColumn && (
                                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                        {columns.find(col => col.key === actionColumn)?.render?.(row[actionColumn])}
                                    </div>
                                )}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                            <div className="space-y-3">
                                {columns.map((column) => {
                                    if (column.key !== identityColumn && column.key !== actionColumn) {
                                        return (
                                            <div key={column.key} className="flex flex-col space-y-1">
                                                <span className="text-sm font-medium text-gray-500">
                                                    {column.header}
                                                </span>
                                                <span>
                                                    {column.render 
                                                        ? column.render(row[column.key])
                                                        : row[column.key]}
                                                </span>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )

    return (
        <>
            <DesktopTable />
            <MobileAccordion />
        </>
    )
} 