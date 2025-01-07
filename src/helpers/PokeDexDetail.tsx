class PokeDexDetailHelper {
  constructor() {}

  async preLoadImages(urls: Array<string | null>) {
    const promises = urls
      .filter((url) => url !== null)
      .map((url) => {
        const image = new Image();
        image.src = url;

        return new Promise((resolve) => {
          image.onload = resolve;
          image.onerror = resolve;
        });
      });

    await Promise.all(promises);
  }
}

export const pokeDexDetailHelper = new PokeDexDetailHelper();
