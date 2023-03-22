//import library yang diperlukan
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const tempoURL = `https://www.tempo.co/search?q=`

async function tempoSearch(keyword){

	//HTTP GET request ke url
	let request = await axios(`${tempoURL}${keyword}&page=1`);
	let htmlRaw = request.data

	//cheerio memproses kode html
	let $ = cheerio.load(htmlRaw)

	//buat variabel untuk menampung object/json
	let news = {
		judul:keyword,
		data:[]
	}

	//css selector untuk mengambil datanya
	$('.card-box.ft240.margin-bottom-sm').each((i, el)=>{
		//variabel penampung sementara
		let temp = {
			index:++i,
			judul:'',
			url:'',
			gambar:'',
			deskripsi:''
		}

		temp.judul = $(el).find('article h2.title').text()
		temp.url = $(el).find('figure a').attr('href')
		temp.gambar = $(el).find('figure img').attr('src')
		temp.deskripsi = $(el).find('article p').text()

		//hasil dimasukkan ke object
		news.data.push(temp)
	})

	return news
}

tempoSearch("jokowi").then(x=>{
	fs.writeFileSync('tempo.json',JSON.stringify(x, null, 2))
	console.log(x)
})