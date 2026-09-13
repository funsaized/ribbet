# Evidence requirements

No implementation or check is represented as completed in this planning package.

For each task record: task ID; exact revision and dirty state; environment and runtime; changed files; each acceptance criterion with PASS/FAIL/UNVERIFIED and supporting artifact; exact commands and exit status; measurements including sample counts; first-attempt failures and corrections; pre-existing failures; unverified items and reason; remaining risks; reviewer decision/date.

For semantic tasks include provider/model/digest if available, quantization, hardware, dataset revision, request/repair counts, rubric scores and cold/warm latency. For agent tasks include prompts, public context supplied, assistance, outcome and failures. For human pilots preserve consent and anonymity; synthetic runs are not human evidence.

Keep large raw logs outside ordinary source control and link retained artifacts. Do not include credentials, content-bearing tokens or private user data. A missing platform or absent API key blocks that gate; it is not evidence of a pass. Any gate revision records rationale before rerunning measurements.
