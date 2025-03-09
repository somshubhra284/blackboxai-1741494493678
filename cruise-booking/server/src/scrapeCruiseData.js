const axios = require('axios');
const cheerio = require('cheerio');

const scrapeCruiseData = async () => {
  try {
    const { data } = await axios.get('https://www.cruisebay.com');
    const $ = cheerio.load(data);
    
    const cruises = [];

    // Example selector, adjust based on actual HTML structure
    $('.cruise-card').each((index, element) => {
      const cruise = {
        name: $(element).find('.cruise-name').text(),
        image: $(element).find('img').attr('src'),
        price: $(element).find('.cruise-price').text(),
        description: $(element).find('.cruise-description').text(),
      };
      cruises.push(cruise);
    });

    console.log(cruises);
  } catch (error) {
    console.error('Error scraping data:', error);
  }
};

scrapeCruiseData();
