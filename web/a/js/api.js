var API = angular.module('wobble.api', []);

var GetTopicsService = function ($timeout) {
	this.$timeout = $timeout;
}
GetTopicsService.$inject = ['$timeout'];
GetTopicsService.prototype.get = function(cb) {
	this.$timeout(function() {
		cb(null, [
      {"id":"7-1368094302922-31311","abstract":"<b>BitTorrent &nbsp;Sync - Requests | Responses<\/b> - TV-Show Secret (RW) 5VFILVYRKORH3JNUPBP7E6O4PEQ444","max_last_touch":1391190801,"post_count_total":4,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
    
    	{"id":"7-1367413829413-79053","abstract":"<b>MyIP<\/b> - #privat&nbsp;Port 9231","max_last_touch":1391187905,"post_count_total":4,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
    
    	{"id":"8f206d8ac382d0ae567f9d03f96d63f3","abstract":"<b>[FEED] <\/b> - Homepage","max_last_touch":1391144747,"post_count_total":2,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
    
    	{"id":"f717d1d0ae0b5002685d8099ace6c4c6","abstract":"<b>[FEED] xkcd.com<\/b> - xkcd.com: A webcomic of romance and math humor.Hom","max_last_touch":1391144745,"post_count_total":5,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
    
    	{"id":"ee16506d64138d51fdd6b01935bbb749","abstract":"<b>[FEED] Kay and P<\/b> - Kay is a college student who's passions are music ","max_last_touch":1391144741,"post_count_total":16,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
    
    	{"id":"2e3c58a167d6ed6e94e13edb74b55ddf","abstract":"<b>[FEED] Weregeek<\/b> - Homepage","max_last_touch":1391144737,"post_count_total":11,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
    
    	{"id":"a301735e0b3d9fa14c029e06bbe9af7b","abstract":"<b>[FEED] QC RSS<\/b> - The Official QC RSS FeedHomepage","max_last_touch":1391144732,"post_count_total":2,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"e80da80c2f2a1a80826969856498d550","abstract":"<b>[FEED] Ninjalooter.de<\/b> - Sind wir nicht alle ein wenig Ninja.Homepage","max_last_touch":1391144726,"post_count_total":16,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"22-1390997371089-90107","abstract":"<b>Geburtstagsgeschenk Luisa<\/b> - Weil mich jetzt schon einige angesprochen haben, m","max_last_touch":1391123513,"post_count_total":7,"topic_messages":"0","users":[{"id":22,"name":"Laura","email":"l.euchler@googlemail.com","img":"cd36cc9bcc405a3d188d8ae1452d27bc","online":0}],"post_count_unread":0,"archived":0},
      {"id":"22-1390760562184-57991","abstract":"<b>Soooofa Alarm :D<\/b> - Liebe Herren!Ich habe eine hoffentlich nicht zu un","max_last_touch":1391115428,"post_count_total":18,"topic_messages":"0","users":[{"id":22,"name":"Laura","email":"l.euchler@googlemail.com","img":"cd36cc9bcc405a3d188d8ae1452d27bc","online":0}],"post_count_unread":0,"archived":0},
      {"id":"7-1367009701388-87724","abstract":"<b>BT-Sync Keys (Privat!)<\/b> - #privat #sol","max_last_touch":1391109921,"post_count_total":6,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"33-1355129249038-48154","abstract":"<b>Ultimativer Usenet-Thread<\/b> - Monet\u00e4re \u00dcbersicht&nbsp;(Abrechnung)--------------","max_last_touch":1391071706,"post_count_total":10,"topic_messages":"0","users":[{"id":33,"name":"Max","email":"floopone@gmx.de","img":"bc9311056baa3b71c6c0a44b0487d506","online":0}],"post_count_unread":0,"archived":0},
      {"id":"b2bd95a3b6df9846dcc6beab69bccab6","abstract":"<b>[FEED] Red Moon Rising<\/b> - a steampunk fantasy webcomicHomepage","max_last_touch":1390971941,"post_count_total":11,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"2d8f34df2d0b226e6e75d0fba4ef8807","abstract":"<b>[FEED] Extra Ordinary<\/b> - This is a webcomicHomepage","max_last_touch":1391058330,"post_count_total":11,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"192d02a019cd3affc1a4952252c5d7dc","abstract":"<b>[FEED] Mostly Erlang \u00bb podcast<\/b> - ErlangHomepage","max_last_touch":1391058304,"post_count_total":34,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":12,"archived":0},
      {"id":"9-1390683257677-45284","abstract":"<b>Ich sammle hier mal Dinge die noch auf meiner London visit ToDo Liste Stehen.<\/b> - Falls einer von euch auch Lust drauf hat kann man ","max_last_touch":1391014762,"post_count_total":11,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"a0547e2b7321c0fa259167a32c54a3c3","abstract":"<b>[FEED] Power Nap RSS Feed<\/b> - An online graphic novelHomepage","max_last_touch":1390971931,"post_count_total":2,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"14-1389712238670-36809","abstract":"<b>Karneval<\/b> - Hallo ihr!Was ist denn so an Karneval geplant? Lau","max_last_touch":1390927332,"post_count_total":7,"topic_messages":"0","users":[{"id":14,"name":"Dani","email":"daniela.haas89@gmx.de","img":"5a120c80b1f1eab1e09234ee8c9c423c","online":0}],"post_count_unread":0,"archived":0},
      {"id":"43bcecf124e51512a972bd6150625fe2","abstract":"<b>[FEED] Plume<\/b> - RSS feed for my webcomic. Powered by ComicCMSHomep","max_last_touch":1390712734,"post_count_total":3,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"7-1323709746760","abstract":"<b>Allgemeine Info-Wave f\u00fcr Alle<\/b> - Wer ist hier alles angemeldet ist, seht ihr oben i","max_last_touch":1353773603,"post_count_total":2,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"9-1388702218687-12777","abstract":"<b>Abschiedsparty<\/b> - : Ich bin dann mal weg :) .Hi, ich m\u00f6chte mich ger","max_last_touch":1390336811,"post_count_total":8,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"7-1358541726681-33424","abstract":"<b>Internet Services<\/b> - Infrastructure in the Cloud","max_last_touch":1390315182,"post_count_total":13,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"8a23e7f1df7f2d39a1218a5e70f6e684","abstract":"<b>[FEED] The Changelog<\/b> - The Changelog covers the intersection of software ","max_last_touch":1389503109,"post_count_total":117,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":104,"archived":0},
      {"id":"9-1388936133387-55869","abstract":"<b>Foto Sharing &amp; Backup Setup<\/b> - Wir haben ja immer das Problem, dass man nicht an ","max_last_touch":1389119818,"post_count_total":10,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"29-1385481516349-3043","abstract":"<b>Silvester \u2013 Party: Gibt es schon\nPl\u00e4ne?<\/b> - So langsam neigt sich das Jahr dem Ende\nund es wir","max_last_touch":1389106449,"post_count_total":70,"topic_messages":"0","users":[{"id":29,"name":"Anna","email":"anna.buszello@gmx.net","img":"93716f7f16a1d858b3e70cd3a52176de","online":0}],"post_count_unread":0,"archived":0},
      {"id":"9-1388699687783-19399","abstract":"<b>Umzugskartons<\/b> - Hi.Hat noch jemand Umzugskartons \u00fcber?","max_last_touch":1389037318,"post_count_total":4,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"9-1388755828561-39861","abstract":"<b>Dokument Backup Share<\/b> - Hi Maik &amp; Stephan,ich hab jetzt angefangen mei","max_last_touch":1388846814,"post_count_total":6,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"9-1387970258766-73920","abstract":"<b>Silvester Dia Show<\/b> - Hi diesmal super spontan (aka knapp) m\u00f6gt ihr mir ","max_last_touch":1388485251,"post_count_total":7,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"30-1388266642147-1097","abstract":"<b>Arbeitsspeicher pls<\/b> - Hey Leute, hier eine Bettelanfrage:Hat jemand von ","max_last_touch":1388346551,"post_count_total":5,"topic_messages":"0","users":[{"id":30,"name":"Pepe","email":"pepe.grz@googlemail.com","img":"8fc81a3cd9750d4c47205fd8839711cd","online":0}],"post_count_unread":0,"archived":0},
      {"id":"21-1388166042942-59318","abstract":"<b>Diana hat eine neue Handynummer.<\/b> - Und widerwillig wird sie diese hier nun nennen.017","max_last_touch":1388232942,"post_count_total":5,"topic_messages":"0","users":[{"id":21,"name":"Diana","email":"diana_dauer@gmx.de","img":"52039ba45f414cd654a6427d5bc7d8cb","online":0}],"post_count_unread":0,"archived":0},
      {"id":"33-1387715581865-8053","abstract":"<b>Lost n Found?<\/b> - Hey,&nbsp;ich suche eine der Spielefiguren die bei","max_last_touch":1387886010,"post_count_total":9,"topic_messages":"0","users":[{"id":33,"name":"Max","email":"floopone@gmx.de","img":"bc9311056baa3b71c6c0a44b0487d506","online":0}],"post_count_unread":0,"archived":0},
      {"id":"18-1387119557525-69248","abstract":"<b>Australien und Cocktails<\/b> - Einige von euch hatten schon gefragt, ob wir mal F","max_last_touch":1387660456,"post_count_total":14,"topic_messages":"0","users":[{"id":18,"name":"Mela","email":"lara036@yahoo.de","img":"1463c9bd39ad0cc3e6b6c83693cadf24","online":0}],"post_count_unread":0,"archived":0},
      {"id":"7-1382908209132-22515","abstract":"<b><\/b> - http:\/\/imgur.com\/r\/Avengers\/wmEPp#Avenger #IronMan","max_last_touch":1387470091,"post_count_total":4,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"9-1387320406836-20494","abstract":"<b>Keep calm and get a job!<\/b> - So hab Heute eine offizielle Zusage von uSwitch be","max_last_touch":1387360125,"post_count_total":7,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"bf091d287aa53c424973f5324ffb6ea3","abstract":"<b>[FEED] Orphan Black Comics<\/b> - Homepage","max_last_touch":1387062979,"post_count_total":2,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"7-1336151686343-92570","abstract":"<b>Sol-System (Stephan's LAN)<\/b> - #homelan #lan #netzwerk #privat #solNamenslisteMer","max_last_touch":1385211005,"post_count_total":3,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"14-1381390114285-60606","abstract":"<b>Maiks Geburtstag, SO 27.10.<\/b> - Habt ihr LUST, ZEIT und GELD Maik zum Geburtstag m","max_last_touch":1384535474,"post_count_total":57,"topic_messages":"0","users":[{"id":14,"name":"Dani","email":"daniela.haas89@gmx.de","img":"5a120c80b1f1eab1e09234ee8c9c423c","online":0}],"post_count_unread":0,"archived":0},
      {"id":"14-1383471269341-97041","abstract":"<b>Kegeln<\/b> - wer hat Lust zu kegeln? Ich hab mich bei der Tradi","max_last_touch":1384535219,"post_count_total":16,"topic_messages":"0","users":[{"id":14,"name":"Dani","email":"daniela.haas89@gmx.de","img":"5a120c80b1f1eab1e09234ee8c9c423c","online":0}],"post_count_unread":0,"archived":0},
      {"id":"9-1384392029452-95218","abstract":"<b>XBMC Addon gesucht<\/b> - Hey, ich suche nach einem Addon f\u00fcr XBMC das folge","max_last_touch":1384460809,"post_count_total":3,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"9-1381101961385-96599","abstract":"<b>Introducing Geoffrey<\/b> - Da ich bock hatte etwas mit Clojure zu implementie","max_last_touch":1383682433,"post_count_total":4,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"13-1377862285780-75993","abstract":"<b>Torrent Download Service<\/b> - Hi zusammen. Hab mir \u00fcberlegt meine VPN Torrent Sa","max_last_touch":1382448732,"post_count_total":2,"topic_messages":"0","users":[{"id":13,"name":"Maik","email":"maik.schwan@gmail.com","img":"e7713def6036264bba6a01ad50ed7b69","online":0}],"post_count_unread":0,"archived":0},
      {"id":"3f6ce85e5874015f272f19b65b3f10c7","abstract":"<b>[FEED] JLOUIS Ramblings<\/b> - Computer Science, Mathematics, Society, Relationsh","max_last_touch":1382159114,"post_count_total":26,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"18-1362332469956-2307","abstract":"<b>Doppelkopf am Mittwoch<\/b> - &lt;immer am Ende gucken&gt;","max_last_touch":1380113907,"post_count_total":50,"topic_messages":"0","users":[{"id":18,"name":"Mela","email":"lara036@yahoo.de","img":"1463c9bd39ad0cc3e6b6c83693cadf24","online":0}],"post_count_unread":0,"archived":0},
      {"id":"12-1329946236142","abstract":"<b>Technische Probleme \/ Bugs Ninjalooter<\/b> - Ich habe seit heute das Problem, dass mir auf Ninj","max_last_touch":1380213523,"post_count_total":90,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"7-1380211663035-29054","abstract":"<b>Firefly Fan-Fic \/ Dr. Who Crossover<\/b> - http:\/\/www.fanfiction.net\/s\/3486089\/1\/The-Man-With","max_last_touch":1380211672,"post_count_total":1,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"9-1379711170789-34104","abstract":"<b>BT Sync private Share<\/b> - Maik wollte von mir Bilder haben. Die liegen jetzt","max_last_touch":1379886292,"post_count_total":3,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"9-1377729175349-45226","abstract":"<b>BTSync jabber bot<\/b> - Hi,die Tag ist mir eingefallen, dass man ja einfac","max_last_touch":1378219741,"post_count_total":7,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"30-1377518715286-62660","abstract":"<b>Umzug:<\/b> - Sonntag 01.09.13&gt;&gt;&gt;&gt; 14 Uhr &lt;&lt;&l","max_last_touch":1378156419,"post_count_total":14,"topic_messages":"0","users":[{"id":30,"name":"Pepe","email":"pepe.grz@googlemail.com","img":"8fc81a3cd9750d4c47205fd8839711cd","online":0}],"post_count_unread":0,"archived":0},
      {"id":"12-1361004765831-36196","abstract":"<b>RPC und Gamescom 2013<\/b> - Mich\u00e9l&nbsp;fragte gerade, ob wir da sind oder nic","max_last_touch":1377861032,"post_count_total":31,"topic_messages":"0","users":[{"id":12,"name":"Karsten","email":"mail2karstenscholz@gmx.de","img":"f3b1f194520fd43994e3032e2904c30b","online":0}],"post_count_unread":0,"archived":0},
      {"id":"13-1377771213176-63662","abstract":"<b>Festplatte<\/b> - Hat jemand von euch zuf\u00e4llig noch ne alte Festplat","max_last_touch":1377798091,"post_count_total":6,"topic_messages":"0","users":[{"id":13,"name":"Maik","email":"maik.schwan@gmail.com","img":"e7713def6036264bba6a01ad50ed7b69","online":0}],"post_count_unread":0,"archived":0},
      {"id":"7-1376577084898-89784","abstract":"<b>JobSuche<\/b> - http:\/\/careers.stackoverflow.com\/jobs\/38755\/full-s","max_last_touch":1376577098,"post_count_total":1,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"7-1332101079186-74825","abstract":"<b>Kontaktdaten<\/b> - #telefon #nummer #handy #mobil #email #imDa es Max","max_last_touch":1362591556,"post_count_total":18,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"7-1331307393280-19322","abstract":"<b>Musik<\/b> - New Young Pony Club - The architects of LoveSnake ","max_last_touch":1371817102,"post_count_total":13,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"7-1369908425980-10190","abstract":"<b>Projekt LunchPayment<\/b> - Idee: WebService f\u00fcr CSV =&gt; XLS transformationA","max_last_touch":1370695917,"post_count_total":2,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"14-1370444709197-83314","abstract":"<b>SilentParty, der zweite Versuch<\/b> - Samstag, 29. Juni, 21-3Uhr, Alter ZollZWEI PARTIES","max_last_touch":1370500199,"post_count_total":5,"topic_messages":"0","users":[{"id":14,"name":"Dani","email":"daniela.haas89@gmx.de","img":"5a120c80b1f1eab1e09234ee8c9c423c","online":0}],"post_count_unread":0,"archived":0},
      {"id":"7-1368520466826-26997","abstract":"<b>Bewertung \/ Review von Hollandh\u00e4usern<\/b> - Hallo zusammen,meine Mutter hat sich auf einem neu","max_last_touch":1368532065,"post_count_total":7,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"13-1366791886453-27983","abstract":"<b>BitTorrent Sync - Serien Filme und Fotos teilen?<\/b> - Hab gerade gelesen das BitTorrent Sync jetzt in de","max_last_touch":1368094299,"post_count_total":64,"topic_messages":"0","users":[{"id":13,"name":"Maik","email":"maik.schwan@gmail.com","img":"e7713def6036264bba6a01ad50ed7b69","online":0}],"post_count_unread":0,"archived":0},
      {"id":"14-1367594935048-17576","abstract":"<b>HELL UND DUNKEL OPEN AIR - 07.09.2013 ab 10 uhr - NEUSS Rennbahnpark<\/b> - &nbsp;Hier war ich schon 2mal, war immer seeehr co","max_last_touch":1367956005,"post_count_total":10,"topic_messages":"0","users":[{"id":14,"name":"Dani","email":"daniela.haas89@gmx.de","img":"5a120c80b1f1eab1e09234ee8c9c423c","online":0}],"post_count_unread":0,"archived":0},
      {"id":"7-1367844117810-77510","abstract":"<b>Berlin, Berlin - ich fahre nach Berlin<\/b> - was suchst du denn? also sowas wie brandenburger t","max_last_touch":1367844180,"post_count_total":1,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"7-1367091585672-11949","abstract":"<b>Urlaub - Segeln<\/b> - http:\/\/join-the-crew.com\/segeltoerns","max_last_touch":1367091591,"post_count_total":1,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"13-1349193376448-7626","abstract":"<b>Usenet Indexer<\/b> - Newzbin2.esMaik zahlt den Account, alle nutzen ihn","max_last_touch":1366835015,"post_count_total":5,"topic_messages":"0","users":[{"id":13,"name":"Maik","email":"maik.schwan@gmail.com","img":"e7713def6036264bba6a01ad50ed7b69","online":0}],"post_count_unread":0,"archived":0},
      {"id":"7-1334347509270-94537","abstract":"<b>Arduino Wobble<\/b> - was muessen wir denn jetzt so besorgen?","max_last_touch":1365939355,"post_count_total":28,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"9-1363163434921-97986","abstract":"<b>wobble client in python<\/b> - Hi,vor ein paar Tagen musste ich 40 Topics archivi","max_last_touch":1363375779,"post_count_total":41,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"13-1358158897091-89136","abstract":"<b>VPN, Torrent und co<\/b> - Hey, ich \u00fcberlege mir einen VPN Anbieter zu suchen","max_last_touch":1358173845,"post_count_total":3,"topic_messages":"0","users":[{"id":13,"name":"Maik","email":"maik.schwan@gmail.com","img":"e7713def6036264bba6a01ad50ed7b69","online":0}],"post_count_unread":0,"archived":0},
      {"id":"33-1357852479588-36390","abstract":"<b>HaveYouMetAd<\/b> - So, jetzt wirds ernst. Wenn du schon auf Datingsei","max_last_touch":1357894373,"post_count_total":1,"topic_messages":"0","users":[{"id":33,"name":"Max","email":"floopone@gmx.de","img":"bc9311056baa3b71c6c0a44b0487d506","online":0}],"post_count_unread":0,"archived":0},
      {"id":"10-1325841215470","abstract":"<b>Kontaktdaten der Ninjas<\/b> - Die Imke ist ganz flei\u00dfig dabei ihre Kontaktdaten ","max_last_touch":1357540575,"post_count_total":9,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"7-1338835573543-26121","abstract":"<b>Du kannst sowas nicht zuf\u00e4lligerweise auch malen? :D<\/b> - http:\/\/i.imgur.com\/c6VvW.jpg","max_last_touch":1353146586,"post_count_total":7,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"22-1348425949143-60721","abstract":"<b>Dani - Geschenk - Geburtstag<\/b> - Hallo hallo,ein Geschenk jagt das N\u00e4chste und wir ","max_last_touch":1351613021,"post_count_total":40,"topic_messages":"0","users":[{"id":22,"name":"Laura","email":"l.euchler@googlemail.com","img":"cd36cc9bcc405a3d188d8ae1452d27bc","online":0}],"post_count_unread":1,"archived":0},
      {"id":"30-1346695409398-48235","abstract":"<b>Pepe TS Serverdaten (privat)<\/b> - 193.192.59.228:5015pw secretofhyrule","max_last_touch":1346965490,"post_count_total":7,"topic_messages":"0","users":[{"id":30,"name":"Pepe","email":"pepe.grz@googlemail.com","img":"8fc81a3cd9750d4c47205fd8839711cd","online":0}],"post_count_unread":0,"archived":0},
      {"id":"33-1346274246655-18495","abstract":"<b>Guild Wars 2<\/b> - Hey,m\u00f6chte jemand noch Guild Wars 2 haben?Aktuell ","max_last_touch":1346658128,"post_count_total":10,"topic_messages":"0","users":[{"id":33,"name":"Max","email":"floopone@gmx.de","img":"bc9311056baa3b71c6c0a44b0487d506","online":0}],"post_count_unread":0,"archived":0},
      {"id":"9-1339065108962-11024","abstract":"<b>Disk Buttler<\/b> - #programming #HTPC #python #nerdstuff #serienjunky","max_last_touch":1343224127,"post_count_total":7,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"7-1340295975818-70133","abstract":"<b>Geburtstags Bilder Wobble<\/b> - 1. Das Bild von der Karte selber (Die Br\u00fccke mit d","max_last_touch":1342803294,"post_count_total":3,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"7-1341183118109-21422","abstract":"<b>Game<\/b> - http:\/\/opengameart.org\/","max_last_touch":1341183124,"post_count_total":1,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"13-1340187163182-95331","abstract":"<b>HTPC - never ending Story...<\/b> - Hey, hab mal wieder ein Problem mit meinem Rechner","max_last_touch":1340271442,"post_count_total":7,"topic_messages":"0","users":[{"id":13,"name":"Maik","email":"maik.schwan@gmail.com","img":"e7713def6036264bba6a01ad50ed7b69","online":0}],"post_count_unread":0,"archived":0},
      {"id":"9-1336000973742-43411","abstract":"<b>MediaCenter: Berlin<\/b> - #mediaserver #htpc #wg #bonnWenn ihr in der WG sei","max_last_touch":1336146337,"post_count_total":2,"topic_messages":"0","users":[{"id":9,"name":"Waldemar","email":"waldemar.schwan@googlemail.com","img":"9bd788f1357722ed25205a22f7a22a99","online":0}],"post_count_unread":0,"archived":0},
      {"id":"7-1335779217673-68238","abstract":"<b>Homeworld<\/b> - Arthttp:\/\/www.reddit.com\/r\/SpecArt\/comments\/jz2ym\/","max_last_touch":1335779273,"post_count_total":1,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"7-1329588650991-48937","abstract":"<b>Wobble History<\/b> - MasterAlles vorherige2012-02-29Locking von Beitr\u00e4g","max_last_touch":1335694859,"post_count_total":3,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0},
      {"id":"13-1330685672189-16004","abstract":"<b>Home Media System<\/b> - Hey, f\u00fcr alle die es interessiert hier mal ne \u00dcber","max_last_touch":1330986791,"post_count_total":12,"topic_messages":"0","users":[{"id":13,"name":"Maik","email":"maik.schwan@gmail.com","img":"e7713def6036264bba6a01ad50ed7b69","online":0}],"post_count_unread":0,"archived":0},
      {"id":"7-1329388674223-60033","abstract":"<b>Online-Radios<\/b> - Hey Jungs,ihr h\u00f6rt doch immer eure diversen Online","max_last_touch":1329589777,"post_count_total":3,"topic_messages":"0","users":[{"id":7,"name":"Stephan Z.","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}],"post_count_unread":0,"archived":0}
    ]);
	}, 1000);
}
API.service('GetTopics', GetTopicsService);


var GetContacts = function($timeout) {
	this.$timeout = $timeout;
};
GetContacts.prototype.get = function(cb) {
	this.$timeout(function() {
		cb(null, [
	  {"email": "stephan@moinz.de", "img": "6b24e6790cb03535ea082d8d73d0a235", "online": "online", "name": "ZeissS"}
	]);
	}, 1000);
};
API.service('GetContacts', GetContacts);



API.factory('API', ['$rootScope', function($rootScope) {
	var wrapper = {};
	var rpc = new JSONRPC('/api/endpoint.php');
	var wobbleApi = new WobbleAPI(rpc, function(err) {
	});
	
	// Builds a dynamic wobble api, which encapsulates Angular :(
	var proto = Object.getPrototypeOf(wobbleApi);
	for (name in proto) {
		if (proto.hasOwnProperty(name)) {
			console.log('Wrapping ', name);
			(function(name) {
				wrapper[name] = function() {
					var args = arguments;
					
					var cb = args[args.length - 1];
					if (typeof(cb) == 'function') {
						args[args.length - 1] = function() {
							var self = this;
							var args = arguments;
							$rootScope.$apply(function() {
								cb.apply(self, args);
							})
						}
					}
					wobbleApi[name].apply(wobbleApi, args);
				};
			})(name);
		}
	}
	
	wrapper.on = function(eventName, cb) {
		BUS.on(eventName, function() {
			var self = this;
			var args = arguments;
			$rootScope.$apply(function () {
				cb.apply(self, args);
			});
		});
	};
	
	wrapper.fire = function(eventName, data) {
		BUS.fire(eventName, data);
	};

	return wrapper;
}]);

API.run(function($rootScope) {
	console.log('run', arguments);
});