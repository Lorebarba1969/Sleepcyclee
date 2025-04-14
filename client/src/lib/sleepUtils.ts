/**
 * Calculate wake times based on 90-minute sleep cycles
 * @param bedtime - Time in format "HH:MM" 
 * @returns Array of wake time objects
 */
export function calculateWakeTimes(bedtime: string): Array<{
  time: string;
  cycles: number;
  hours: number;
  label?: string;
}> {
  // Parse the bedtime string (format: "HH:MM")
  const [hoursStr, minutesStr] = bedtime.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  
  // Create a date object for the current day with the provided bedtime
  const bedtimeDate = new Date();
  bedtimeDate.setHours(hours, minutes, 0, 0);
  
  // Add 15 minutes to account for falling asleep
  const fallAsleepDate = new Date(bedtimeDate.getTime() + 15 * 60 * 1000);
  
  // Calculate wake times for 4-7 complete sleep cycles
  const wakeTimes = [];
  
  for (let cycles = 4; cycles <= 7; cycles++) {
    // Each sleep cycle is 90 minutes
    const wakeTime = new Date(fallAsleepDate.getTime() + cycles * 90 * 60 * 1000);
    
    // Format the wake time as HH:MM
    const wakeHours = wakeTime.getHours().toString().padStart(2, '0');
    const wakeMinutes = wakeTime.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${wakeHours}:${wakeMinutes}`;
    
    // Calculate total sleep time
    const sleepHours = cycles * 1.5; // 90 minutes = 1.5 hours
    const sleepMinutes = cycles * 90; // Store minutes as integer for the database
    
    // Determine if this is a recommended wake time
    let label;
    if (cycles === 4) {
      label = 'Minimo';
    } else if (cycles === 5) {
      label = 'Ideale';
    }
    
    wakeTimes.push({
      time: formattedTime,
      cycles,
      hours: sleepMinutes, // Store as minutes for database, convert to hours when displaying
      displayHours: sleepHours, // For display purposes only
      label
    });
  }
  
  return wakeTimes;
}
