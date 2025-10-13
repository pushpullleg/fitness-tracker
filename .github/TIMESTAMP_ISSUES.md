# 🕐 Timestamp & "Today" Definition Issues

**Date Discovered:** October 12, 2025  
**Reported By:** Mukesh Ravichandran

---

## 🐛 Issue #1: Wrong Time Display in Emails

### Problem Description
Email shows times like "12:47 AM, 12:46 AM" instead of the actual time activities were logged (likely around 7-8 PM CST when you logged them).

### Root Cause

**Current Code** (lines 625-631 in `backend/index.js`):
```javascript
const time = new Date(activity.timestamp).toLocaleTimeString('en-US', { 
  hour: 'numeric', 
  minute: '2-digit',
  hour12: true 
});
```

**The Problem:**
1. Timestamp from GitHub Gist is stored as: `"2025-10-12T19:47:00.000Z"` (UTC)
2. When converted with `toLocaleTimeString()` without timezone, it uses **server timezone (UTC)**
3. Server interprets it as UTC and displays UTC time
4. Your CST time (19:47 = 7:47 PM CST) becomes 12:47 AM UTC next day

### Example Flow
```
You log activity: 7:47 PM CST (Oct 12)
         ↓
GitHub Gist stores: "2025-10-13T01:47:00.000Z" (UTC - Oct 13 at 1:47 AM)
         ↓
Database stores: 2025-10-13 01:47:00+00 (UTC)
         ↓
Email displays: 12:47 AM (shows as next day UTC, off by ~6 hours)
```

### Solution
Convert to **CST timezone** when displaying:

```javascript
const time = new Date(activity.timestamp).toLocaleTimeString('en-US', { 
  hour: 'numeric', 
  minute: '2-digit',
  hour12: true,
  timeZone: 'America/Chicago'  // ← Add CST timezone
});
```

---

## 🐛 Issue #2: "Today" Definition

### Current Behavior

**Code** (lines 425-427 in `backend/index.js`):
```javascript
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);  // Midnight UTC
```

**What This Means:**
- "Today" = **Midnight UTC to current time UTC**
- In CST, this is: **6 PM CST yesterday to current time**

### Example Problem

If email runs at **2 PM CST (20:00 UTC)**:

**Current "Today" window:**
- Start: 00:00 UTC = **6 PM CST previous day**
- End: 20:00 UTC = 2 PM CST current day

So "today's activities" actually includes:
- ✅ 6 PM CST yesterday → Midnight CST
- ✅ Midnight CST → 2 PM CST today

**But excludes:**
- ❌ Midnight CST → 6 PM CST yesterday (wrong!)

### Your Expected Behavior

You want "Today" to mean:
- **2 PM CST yesterday → 2 PM CST today**

This matches the email schedule (runs at 2 PM daily).

### Solution Options

#### Option 1: Last 24 Hours (Recommended)
```javascript
const todayStart = new Date();
todayStart.setHours(todayStart.getHours() - 24);  // Last 24 hours
```

**Result:** Shows all activities from last 2 PM to current 2 PM

#### Option 2: Midnight CST to Now CST
```javascript
// Get midnight in CST timezone
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

// Convert to CST midnight (adjust for UTC-6)
const cstOffset = 6 * 60; // 6 hours in minutes
const utcOffset = todayStart.getTimezoneOffset();
todayStart.setMinutes(todayStart.getMinutes() + utcOffset + cstOffset);
```

**Result:** Shows activities from midnight CST to current time

#### Option 3: Since Last Email (Best for Your Use Case)
```javascript
// Email runs at 2 PM CST daily
// So get activities since yesterday's 2 PM CST
const todayStart = new Date();
const currentHour = todayStart.getUTCHours();

// If before 20:00 UTC (2 PM CST), get since yesterday's 20:00 UTC
// If after 20:00 UTC, get since today's 20:00 UTC
if (currentHour < 20) {
  todayStart.setDate(todayStart.getDate() - 1);
}
todayStart.setUTCHours(20, 0, 0, 0);  // 2 PM CST = 20:00 UTC
```

**Result:** Shows activities **since last email was sent (yesterday 2 PM → today 2 PM)**

---

## 📊 Comparison of Options

| Option | "Today" Window | Pros | Cons |
|--------|----------------|------|------|
| **Current** | Midnight UTC → Now | Simple | Wrong timezone, confusing |
| **Last 24 Hours** | 24 hours ago → Now | Simple, consistent | Doesn't align with "day" concept |
| **Midnight CST** | Midnight CST → Now | Matches calendar day | Complex timezone conversion |
| **Since Last Email** ⭐ | Yesterday 2PM → Today 2PM | Matches email schedule perfectly | Slightly more complex |

---

## 🎯 Recommended Fix

### Fix Both Issues Together

**Current Problems:**
1. ❌ Times show in UTC (wrong timezone)
2. ❌ "Today" is based on UTC midnight (confusing)

**Recommended Solution:**
1. ✅ Display times in **CST timezone**
2. ✅ Define "today" as **since last email (yesterday 2 PM CST)**

This way:
- Email at 2 PM shows activities from yesterday 2 PM to today 2 PM
- All times displayed in CST (your local timezone)
- Clear 24-hour window matching email schedule

---

## 🔧 Code Changes Needed

### 1. Fix Time Display (Line 625-631)

**Before:**
```javascript
const time = new Date(activity.timestamp).toLocaleTimeString('en-US', { 
  hour: 'numeric', 
  minute: '2-digit',
  hour12: true 
});
```

**After:**
```javascript
const time = new Date(activity.timestamp).toLocaleTimeString('en-US', { 
  hour: 'numeric', 
  minute: '2-digit',
  hour12: true,
  timeZone: 'America/Chicago'  // CST timezone
});
```

### 2. Fix "Today" Definition (Lines 425-427)

**Before:**
```javascript
// Get today's activities (since midnight)
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);
```

**After (Option 3 - Since Last Email):**
```javascript
// Get today's activities (since last email at 2 PM CST)
const todayStart = new Date();
const currentHour = todayStart.getUTCHours();

// If before 20:00 UTC (2 PM CST), get since yesterday's 20:00 UTC
// If after 20:00 UTC, get since today's 20:00 UTC
if (currentHour < 20) {
  todayStart.setDate(todayStart.getDate() - 1);
}
todayStart.setUTCHours(20, 0, 0, 0);  // 2 PM CST = 20:00 UTC
```

**Or (Option 1 - Simple Last 24 Hours):**
```javascript
// Get today's activities (last 24 hours)
const todayStart = new Date();
todayStart.setHours(todayStart.getHours() - 24);
```

---

## 📝 Testing Plan

### Before Fix
Send test email and verify:
- [ ] Times show in UTC (wrong)
- [ ] "Today" includes activities from 6 PM yesterday

### After Fix
Send test email and verify:
- [ ] Times show in CST (correct)
- [ ] "Today" includes activities from yesterday 2 PM to today 2 PM
- [ ] Activities logged at 7:47 PM show as "7:47 PM" not "12:47 AM"

---

## 🎯 Implementation Priority

### High Priority (Fix Immediately)
1. ✅ **Time Display** - Shows wrong times, very confusing
2. ✅ **"Today" Definition** - Should align with email schedule

### Why This Matters
- **User Confusion:** Times showing 12 AM when activity was at 7 PM is very misleading
- **Email Relevance:** "Today's activities" should match the 24-hour period since last email
- **Team Understanding:** Everyone should see times in their local timezone (CST)

---

## 🌍 Timezone Reference

| Location | Timezone | Offset from UTC |
|----------|----------|-----------------|
| **Texas** | **CST** | **UTC-6** |
| Server (Vercel) | UTC | UTC+0 |
| India | IST | UTC+5:30 |

**Example:**
- 7:47 PM CST = 01:47 UTC (next day)
- When displayed without timezone, shows as 12:47 AM UTC = **WRONG**
- Should display as 7:47 PM CST = **CORRECT**

---

**Would you like me to implement these fixes now?**

We should:
1. Add `timeZone: 'America/Chicago'` to time display
2. Change "today" to mean "since last email (2 PM yesterday → 2 PM today)"

This will make the email much more accurate and useful! 🎯
