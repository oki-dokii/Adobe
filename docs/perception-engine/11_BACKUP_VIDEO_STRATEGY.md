# Backup Video Strategy

**Asset:** `docs/perception-engine/assets/backup-demo.mp4` (git-lfs or Google Drive; **do not** rely on localhost)  
**Length:** 4:50  
**Resolution:** 1920×1080, 30fps, no music, mic on talk track **or** captions burned in  
**Backup-backup:** 720p copy on phone + USB

---

# Purpose

If live UI dies, judges still see interrogation, skip-skill, tree X-ray, export. Silence while debugging is a loss.

---

# Why It Exists

Hackathon Wi-Fi, React errors, LLM timeout, Python segfault.

---

# User Experience

**Trigger:** Driver says “We’ll show the recorded evaluation while we recover.” Switch HDMI / share the file within **15 seconds**. Do not narrate stack traces.

**On-screen first frame:** same landing disclaimer.

**Captions:** Hard-burn key lines from 09 (honesty, marketplace, simulated).

After video: if UI recovered, jump to Q&A on live; if not, Q&A on video.

---

# Inputs

- OBS or QuickTime screen + mic  
- 09 script  
- Machine that **completed a clean rehearsal**

---

# Outputs

| File | Use |
|---|---|
| `backup-demo.mp4` | Primary |
| `backup-demo-captions.srt` | Optional |
| `backup-stills/` 8 PNGs | If video player fails: click-through stills |

Stills (in order): landing, tree running, perception org, offer refuse, span highlight, memory empty offer, skip render, export file.

---

# Internal Logic

**Record Day 3 morning after a passing rehearsal.**  
Do **not** record until skip-skill works.

**Edit:** cut idle > 3s; keep packet growth.

**Failover decision tree:**

```
t=0 live start
if error before URL submit → video from 0:00
if error during audit → video from 0:40
if perception fails → video from 1:20
if highlight fails → stay live, skip that beat
if total freeze → video immediately
```

**Never** record mock data if Day 1 playback of **real eval JSON** exists — record that.

---

# Integration Points

Same product as 09. Stills help 08 (export screenshot).

---

# Backend Requirements

None at showtime.

---

# Frontend Requirements

Presenter laptop: VLC / QuickTime pre-opened, paused on frame 0, volume 80%.

---

# Success Metrics

File plays offline. Captions include U12 honesty. Length ≤ 5:15.

---

# Demo Value

Saves the round.

---

# Marketplace Alignment

Video **must** include the skip-skill beat or it undersells Adobe.

---

# Risks

Recording an old build. **Re-record after freeze, not before.**  
Copyright music. **None.**

---

# Future Extensions

Picture-in-picture talker; not needed.
