import jobsData from './jobs.json'
import locationsData from './locations.json'
import erasData from './eras.json'

export const jobs = jobsData
export const locations = locationsData
export const eras = erasData

// Helper functions to get data by ID
export const getJob = (id: string) => jobs[id as keyof typeof jobs]
export const getLocation = (id: string) => locations[id as keyof typeof locations]
export const getEra = (id: string) => eras[id as keyof typeof eras]

// Get all items as arrays with IDs
export const getJobsArray = () => 
  Object.entries(jobs).map(([id, data]) => ({ id, ...data }))

export const getLocationsArray = () => 
  Object.entries(locations).map(([id, data]) => ({ id, ...data }))

export const getErasArray = () => 
  Object.entries(eras).map(([id, data]) => ({ id, ...data }))