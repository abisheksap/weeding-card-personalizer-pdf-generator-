# Wedding Invitation Studio v35

Complete build with fixed guest sharing URL generation.

## Important fix
The previous Share flow used `btoa(...)` and then manually removed `%` from encoded padding, producing malformed URLs ending in `3D3D` (for example `...ifQ3D3D`). v35 uses the same Base64URL encoder as the guest decoder, so generated links are clean and valid.

Example:
`/i/eyJuYW1lIjoiQWJpc2hhIFNwa290YSBTaGFybWEiLCJhZGRyZXNzIjoiQmFyYXRwdXIifQ`

No `3D3D` suffix is added.
