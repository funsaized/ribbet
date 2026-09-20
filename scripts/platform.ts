/** Artifact spelling differs from Node's win32 platform identifier. */
export const hostTarget = `${process.platform === 'win32' ? 'windows' : process.platform}-${process.arch}`;

export const binaryName = process.platform === 'win32' ? 'ribbit.exe' : 'ribbit';

export const cleanEnvironment = (home: string) => ({
  PATH: process.env.PATH,
  ...(process.platform === 'win32'
    ? {
        SystemRoot: process.env.SystemRoot,
        TEMP: process.env.TEMP,
        TMP: process.env.TMP,
        PATHEXT: process.env.PATHEXT,
        USERPROFILE: home,
      }
    : {}),
  HOME: home,
});
