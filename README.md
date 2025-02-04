# hevy-toolbox

Hevy Toolbox is a command-line tool for managing Hevy workout publishings and converting. It leverages the [Hevy API](https://api.hevyapp.com/docs) for publishing the workouts and fetching the available exercises in your Hevy account.

## How it works

Hevy Toolbox has the following features:

- Converting Fitbod export files to Hevy workouts
- Publishing properly formatted Hevy workouts
- Adding/removing custom equivalences between the exercises from the input file and the corresponding exercises available on your Hevy account

## Instalation

Hevy Toolbox is distributed through npm and can be installed like this:

### npm

```bash
npm install hevy-toolbox
```

### Yarn

```bash
yarn add hevy-toolbox
```

### Bun

```bash
bun add hevy-toolbox
```

## Running from source

Hevy Toolbox is build on top of [Bun](https://bun.sh/). If you wanna run from source, clone the repository and then do the following:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

For more information on how to install Bun, check out their website: https://bun.sh/

### Local linking

If you want to test the package as if it were published, you can run:

```bash
bun link # run this inside the package folder
```

```bash
bun link hevy-toolbox # run this inside the application/place you want to use hevy-toolbox
```
