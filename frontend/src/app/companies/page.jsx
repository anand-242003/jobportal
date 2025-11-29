"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./companies.module.css";

export default function CompaniesPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("all");
    const [selectedJobType, setSelectedJobType] = useState("all");

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await axiosInstance.get("/jobs");
            const jobs = response.data.jobs || [];

            const companyMap = new Map();

            jobs.forEach(job => {
                const employerName = job.created_by?.fullName || "Unknown Company";
                const employerId = job.created_by?.id || `unknown-${Date.now()}-${Math.random()}`;

                if (!companyMap.has(employerId)) {
                    companyMap.set(employerId, {
                        id: employerId,
                        name: employerName,
                        jobs: [],
                        totalJobs: 0,
                        locations: new Set(),
                        jobTypes: new Set()
                    });
                }

                const company = companyMap.get(employerId);
                company.jobs.push(job);
                company.totalJobs++;
                company.locations.add(job.location);
                company.jobTypes.add(job.jobType);
            });

            const companiesArray = Array.from(companyMap.values()).map(c => ({
                ...c,
                locations: Array.from(c.locations),
                jobTypes: Array.from(c.jobTypes)
            }));

            setCompanies(companiesArray);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching companies:", err);
            setLoading(false);
        }
    };

    const allLocations = [...new Set(companies.flatMap(c => c.locations))];
    const allJobTypes = [...new Set(companies.flatMap(c => c.jobTypes))];

    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = selectedLocation === "all" || company.locations.includes(selectedLocation);
        const matchesJobType = selectedJobType === "all" || company.jobTypes.includes(selectedJobType);
        return matchesSearch && matchesLocation && matchesJobType;
    });

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.loading}>Loading companies...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerText}>
                        <h1 className={styles.title}>Companies Hiring</h1>
                        <p className={styles.subtitle}>
                            {companies.length} companies with {companies.reduce((sum, c) => sum + c.totalJobs, 0)} open positions
                        </p>
                    </div>
                </div>

                <div className={styles.filters}>
                    <div className={styles.searchBox}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className={styles.filterSelect}
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                        <option value="all">All Locations</option>
                        {allLocations.sort().map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>

                    <select
                        className={styles.filterSelect}
                        value={selectedJobType}
                        onChange={(e) => setSelectedJobType(e.target.value)}
                    >
                        <option value="all">All Job Types</option>
                        {allJobTypes.sort().map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.stats}>
                    Showing {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'}
                </div>

                {filteredCompanies.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No companies found matching your criteria</p>
                        <button onClick={() => { setSearchTerm(""); setSelectedLocation("all"); setSelectedJobType("all"); }} className={styles.clearButton}>
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className={styles.companiesList}>
                        {filteredCompanies.map((company) => (
                            <div key={company.id} className={styles.companyCard}>
                                <div className={styles.companyHeader}>
                                    <div className={styles.companyInfo}>
                                        <h2 className={styles.companyName}>{company.name}</h2>
                                        <div className={styles.companyMeta}>
                                            <span className={styles.jobCount}>
                                                {company.totalJobs} {company.totalJobs === 1 ? 'position' : 'positions'}
                                            </span>
                                            <span className={styles.separator}>•</span>
                                            <span className={styles.locations}>
                                                {company.locations.slice(0, 2).join(", ")}
                                                {company.locations.length > 2 && ` +${company.locations.length - 2}`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.jobTypes}>
                                        {company.jobTypes.map(type => (
                                            <span key={type} className={styles.typeTag}>{type}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.jobsList}>
                                    {company.jobs.slice(0, 4).map((job) => (
                                        <Link
                                            key={job.id}
                                            href={`/jobs/${job.id}`}
                                            className={styles.jobItem}
                                        >
                                            <div className={styles.jobInfo}>
                                                <span className={styles.jobTitle}>{job.title}</span>
                                                <span className={styles.jobMeta}>
                                                    {job.location} • {job.experienceLevel}+ years
                                                </span>
                                            </div>
                                            <div className={styles.jobRight}>
                                                <span className={styles.jobSalary}>{job.salary.split(' ')[0]}</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                        </Link>
                                    ))}

                                    {company.totalJobs > 4 && (
                                        <div className={styles.viewAllContainer}>
                                            <Link
                                                href={`/jobs?company=${company.name}`}
                                                className={styles.viewAllLink}
                                            >
                                                View all {company.totalJobs} positions →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
