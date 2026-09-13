# Owner-led setup pilot

The owner has volunteered as participant 1 and will recruit additional participants. No completed session or recruitment result is assumed. The release gate remains at least four successful first runs out of five participants, within ten minutes excluding model download.

Give each participant the packaged distribution and public usage guide. Use a separate project directory and existing loopback LM Studio server. Start the timer after model download; include configuration and troubleshooting time. Record help requests and failures, even if a later retry succeeds. Do not share API keys or confidential source files.

Tasks:

1. Run help/version and discover available commands.
2. Run `printf 'one\ntwo\nthree\n' | ribbit take 2 --input lines --output jsonl`.
3. Discover the existing LM Studio endpoint using `ribbit setup --json`; configure a profile if necessary.
4. Ask for a short explanation of a nonconfidential text file through that profile.
5. Run a saved or inline exact flow from the usage guide.
6. Identify one real recurring task they would use Ribbit for; this is feedback, not an adoption claim.

Copy session-template.json for each participant. Use pseudonymous IDs. Record actual elapsed time, model/download details, observed outputs, obstacles, assistance and voluntary follow-up intent. Return results to the owner; no automatic outreach or telemetry occurs. The owner's ongoing development use is not automatically a completed measured pilot.
