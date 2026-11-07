/* Eso dijo ella: datos y lógica del mapa */
/* [nombre, nacimiento, muerte (null = vive, "?" = desconocida), aproximada (1) — o 2: no se sabe el nacimiento y el año es el de su obra clave —, lugar, corriente, temas, idea, peso] */
const D=[
["Enheduana", -2300, "?", 1, "Ur, Mesopotamia", "Poesía sacerdotal sumeria", "mistica estetica", "Suma sacerdotisa de Nanna en Ur y quizá la autora más antigua de nombre conocido: himnos a Inanna y a los templos de Sumer.", 2],
["Gargi Vachaknavi", -700, "?", 1, "Videha, India", "Upanishads", "metafisica conocimiento", "Interroga a Yajñavalkya sobre aquello en lo que todo el universo está «tejido» en la Brihadaranyaka Upanishad.", 2],
["Maitreyi", -700, "?", 1, "Videha, India", "Upanishads", "metafisica mistica", "Renuncia a la riqueza para preguntar por la inmortalidad y el Atman en su diálogo con Yajñavalkya.", 1],
["Temistoclea", -600, "?", 1, "Delfos", "Presocrática", "etica mistica", "Sacerdotisa de Delfos de quien, según Aristóxeno citado por Diógenes Laercio, Pitágoras tomó la mayoría de sus doctrinas morales.", 1],
["Teano", -550, "?", 1, "Crotona", "Pitagorismo", "etica metafisica", "Pitagórica de Crotona a la que se atribuyen un tratado sobre la piedad y el número y cartas sobre la vida doméstica; la autoría es discutida.", 2],
["Aspasia de Mileto", -470, -400, 1, "Mileto / Atenas", "Retórica ateniense", "politica lenguaje", "Maestra de retórica en la Atenas de Pericles; Platón le atribuye el discurso fúnebre del Menéxeno.", 2],
["Diotima de Mantinea", -440, "?", 1, "Mantinea", "Platonismo", "mistica etica", "En el Banquete de Platón enseña a Sócrates la escala del amor, de los cuerpos bellos a la Belleza misma; quizá sea un personaje literario.", 2],
["Arete de Cirene", -400, "?", 1, "Cirene", "Escuela cirenaica", "etica cuerpo", "Hija de Aristipo, a veces considerada su sucesora en la escuela cirenaica; educó a su hijo, apodado «Metrodidacto» («enseñado por la madre»).", 1],
["Lastenia de Mantinea", -350, "?", 1, "Mantinea / Atenas", "Academia platónica", "metafisica conocimiento", "Según Diógenes Laercio, estudió en la Academia con Platón y Espeusipo; al parecer, vestida de hombre.", 1],
["Hiparquia de Maronea", -350, -280, 1, "Maronea / Atenas", "Cinismo", "cuerpo etica politica", "Cínica que eligió la pobreza y la vida pública con Crates; defendió dedicar su tiempo a la filosofía y no al telar.", 2],
["Leontion", -300, "?", 1, "Atenas", "Epicureísmo", "etica conocimiento", "Epicúrea del Jardín; según Cicerón y Plinio, refutó a Teofrasto en un tratado perdido de elegante estilo ático.", 1],
["Ban Zhao", 45, 117, 1, "Han, China", "Confucianismo", "educacion etica", "Historiadora de la corte Han; en sus «Lecciones para mujeres» defiende que las niñas reciban educación.", 2],
["Macrina la Joven", 324, 379, 1, "Capadocia", "Patrística", "mistica metafisica", "Monja de Capadocia; su hermano Gregorio de Nisa recoge sus conversaciones sobre el alma en el «Diálogo sobre el alma y la resurrección».", 1],
["Sosípatra", 300, "?", 1, "Pérgamo (nacida en Éfeso), Asia Menor", "Neoplatonismo", "mistica metafisica", "Neoplatónica y mística nacida en Éfeso; tras enviudar enseñó en Pérgamo, célebre por su sabiduría y su clarividencia.", 1],
["Hipatia de Alejandría", 355, 415, 1, "Alejandría", "Neoplatonismo", "ciencia metafisica logica", "Matemática, astrónoma y maestra neoplatónica de Alejandría; su asesinato la volvió símbolo, casi mito, del fin del mundo clásico.", 3],
["Rabia al-Adawiyya", 714, 801, 1, "Basora", "Sufismo", "mistica etica", "Mística sufí que propuso amar a Dios sin miedo al infierno ni deseo del paraíso.", 2],
["Eloísa", 1100, 1164, 1, "París", "Escolástica", "etica cuerpo", "En sus cartas a Abelardo sostiene que lo que cuenta es la intención, y defiende un amor libre frente al matrimonio.", 2],
["Hildegarda de Bingen", 1098, 1179, 0, "Renania", "Mística medieval", "mistica ciencia estetica", "Abadesa, visionaria, compositora y naturalista; pensó la «viriditas», la fecundidad verde que Dios da a la naturaleza y al espíritu.", 3],
["Akka Mahadevi", 1130, 1160, 1, "Karnataka, India", "Bhakti / Virashaivismo", "mistica cuerpo", "Poeta-santa que rechazó las normas sociales y la ropa en su búsqueda de Shiva.", 1],
["Hadewijch de Amberes", 1200, 1260, 1, "Brabante", "Mística beguina", "mistica estetica", "Beguina y mística: visiones, cartas y poemas sobre la «minne», el amor divino, y la unión del alma con Dios.", 1],
["Matilde de Magdeburgo", 1207, 1282, 1, "Sajonia", "Mística beguina y cisterciense", "mistica estetica", "«La luz que fluye de la divinidad»: visiones, oraciones y diálogos en bajo alemán; beguina y luego monja en Helfta.", 1],
["Margarita Porete", 1250, 1310, 1, "Henao", "Mística beguina", "mistica conocimiento", "«El espejo de las almas simples»: el alma «aniquilada» lo ha dejado todo salvo a Dios. Fue quemada en París en 1310.", 2],
["Lal Ded", 1320, 1392, 1, "Cachemira", "Shivaísmo de Cachemira", "mistica cuerpo", "Sus «vakh», versos en cachemir, buscan la experiencia directa de lo divino, más allá del ritual.", 1],
["Juliana de Norwich", 1342, 1416, 1, "Norwich", "Mística medieval", "mistica existencia", "«Todo irá bien»: «Revelaciones del amor divino» (c. 1393), quizá el primer libro escrito en inglés por una mujer.", 2],
["Catalina de Siena", 1347, 1380, 0, "Siena", "Mística medieval", "mistica politica", "Mística que intervino en la política de la Iglesia y escribió «El diálogo».", 2],
["Beatriz de Nazaret", 1200, 1268, 1, "Tienen (Brabante, Bélgica)", "Mística cisterciense", "mistica etica", "«De los siete grados del amor», en neerlandés medio: se considera el primer escrito místico de una mujer en lengua vulgar.", 1],
["Gertrudis de Helfta", 1256, 1302, 0, "Eisleben / Helfta, Alemania", "Mística de Helfta", "mistica etica", "«Heraldo del amor divino»: una espiritualidad centrada en el corazón de Cristo y en la «libertad de corazón».", 1],
["Ángela de Foligno", 1248, 1309, 1, "Foligno, Italia", "Mística franciscana", "mistica cuerpo", "Dictó el «Memorial»: su conversión y su camino espiritual, contados paso a paso.", 1],
["Margery Kempe", 1373, "?", 1, "King's Lynn, Inglaterra", "Mística inglesa", "mistica cuerpo", "Dictó «El libro de Margery Kempe», que algunos consideran la primera autobiografía en inglés: visiones y peregrinaciones.", 1],
["Janabai", 1258, 1350, 1, "Gangakhed, Maharashtra, India", "Bhakti varkari", "mistica estetica", "Santa y poeta marathi, devota de Vithoba; se le atribuyen unos 300 abhangs.", 1],
["Christine de Pizan", 1364, 1430, 1, "Venecia / París", "Humanismo", "feminismo politica educacion", "«La ciudad de las damas» (1405): historias de mujeres ilustres contra la misoginia del «Roman de la Rose» y de su tiempo.", 3],
["Isotta Nogarola", 1418, 1466, 0, "Verona", "Humanismo", "etica conocimiento", "Humanista que debatió quién pecó más, Eva o Adán, para discutir la responsabilidad moral.", 1],
["Teresa de Cartagena", 1425, "?", 1, "Burgos", "Mística castellana", "existencia mistica cuerpo", "Escribió desde la sordera «Arboleda de los enfermos» y defendió el derecho de las mujeres a escribir.", 1],
["Laura Cereta", 1469, 1499, 0, "Brescia", "Humanismo", "educacion feminismo", "Humanista que defendió en sus cartas la educación de las mujeres.", 1],
["Mirabai", 1498, 1546, 1, "Rajastán, India", "Bhakti", "mistica estetica", "Princesa y poeta de Krishna que desafió las convenciones de casta y familia.", 1],
["Teresa de Ávila", 1515, 1582, 0, "Ávila", "Mística española", "mistica existencia", "«Las moradas»: un mapa del alma como castillo interior.", 3],
["Oliva Sabuco", 1562, 1646, 1, "Alcaraz", "Filosofía natural", "cuerpo mente ciencia", "«Nueva filosofía de la naturaleza del hombre» (1587): las emociones afectan a la salud del cuerpo. Su padre le disputó la autoría.", 1],
["Marie de Gournay", 1565, 1645, 0, "París", "Protofeminismo", "feminismo educacion", "«De la igualdad de los hombres y las mujeres», y editora de los Ensayos de Montaigne.", 2],
["Anna Maria van Schurman", 1607, 1678, 0, "Colonia / Utrecht", "Pietismo", "educacion conocimiento", "Primera mujer admitida a clases en la Universidad de Utrecht (1636); defendió que las mujeres estudien letras y ciencia.", 1],
["Isabel de Bohemia", 1618, 1680, 0, "Heidelberg / La Haya", "Cartesianismo", "mente metafisica", "Pregunta a Descartes cómo puede un alma inmaterial mover un cuerpo: el problema mente-cuerpo.", 2],
["Margaret Cavendish", 1623, 1673, 0, "Inglaterra", "Filosofía natural", "metafisica ciencia", "Materialista vitalista: toda materia percibe y piensa. También escribió ciencia ficción.", 2],
["Anne Conway", 1631, 1679, 0, "Inglaterra", "Neoplatonismo de Cambridge", "metafisica mistica", "Un universo de espíritu y materia en continuidad; influyó en la monadología de Leibniz.", 2],
["Sor Juana Inés de la Cruz", 1648, 1695, 1, "Nueva España", "Barroco novohispano", "conocimiento feminismo estetica", "«Respuesta a Sor Filotea»: defensa del derecho de las mujeres a saber. «Primero sueño», el viaje del alma por el conocimiento.", 3],
["Damaris Masham", 1659, 1708, 0, "Cambridge, Inglaterra", "Platonismo de Cambridge", "etica educacion", "«Un discurso acerca del amor de Dios» (1696) y la educación de las mujeres; Locke vivió en su casa hasta su muerte.", 1],
["Mary Astell", 1666, 1731, 0, "Newcastle", "Cartesianismo", "feminismo politica educacion", "«Si todos los hombres nacen libres, ¿por qué todas las mujeres nacen esclavas?» («Some Reflections upon Marriage», 1700).", 2],
["Catharine Trotter Cockburn", 1679, 1749, 0, "Londres", "Filosofía moral anglicana", "etica conocimiento", "Defendió el «Ensayo» de Locke (1702) y reflexionó sobre el fundamento de la obligación moral; también dramaturga.", 1],
["Émilie du Châtelet", 1706, 1749, 0, "París", "Ilustración", "ciencia metafisica logica", "Tradujo y comentó los Principia de Newton; en sus «Instituciones de física» defendió la vis viva de Leibniz frente a los newtonianos.", 3],
["Laura Bassi", 1711, 1778, 0, "Bolonia", "Ilustración", "ciencia", "Primera mujer catedrática universitaria de física, defensora de Newton en Italia.", 1],
["Olympe de Gouges", 1748, 1793, 0, "Montauban / París", "Ilustración", "politica feminismo", "«Declaración de los derechos de la mujer y de la ciudadana». Fue guillotinada.", 2],
["Josefa Amar y Borbón", 1749, 1833, 0, "Zaragoza", "Ilustración española", "educacion feminismo", "«Discurso sobre la educación física y moral de las mujeres».", 1],
["Mary Wollstonecraft", 1759, 1797, 0, "Londres", "Ilustración", "feminismo politica educacion", "«Vindicación de los derechos de la mujer»: la razón no tiene sexo.", 3],
["Sophie de Grouchy", 1764, 1822, 0, "Meulan, Francia", "Ilustración", "etica politica", "«Cartas sobre la simpatía» (1798), publicadas junto a su traducción de la «Teoría de los sentimientos morales» de Adam Smith.", 1],
["Germaine de Staël", 1766, 1817, 0, "París / Coppet", "Romanticismo", "estetica politica", "Llevó el romanticismo alemán a Francia y pensó la literatura en relación con las instituciones sociales.", 2],
["Mary Shepherd", 1777, 1847, 0, "Barnbougle (Edimburgo), Escocia", "Filosofía de la causalidad", "metafisica conocimiento", "Criticó a Hume sobre la relación de causa y efecto (nada empieza a existir sin causa) y argumentó contra el idealismo de Berkeley.", 1],
["Sojourner Truth", 1797, 1883, 1, "Nueva York", "Abolicionismo", "raza feminismo politica", "Nacida esclavizada, unió en su voz la lucha abolicionista y la de las mujeres.", 2],
["Harriet Martineau", 1802, 1876, 0, "Norwich", "Economía política", "economia politica", "Pionera de la sociología; tradujo a Comte y analizó la sociedad estadounidense.", 1],
["Flora Tristán", 1803, 1844, 0, "París / Perú", "Socialismo", "politica economia feminismo", "«La Unión Obrera»: propuso una internacional de trabajadoras y trabajadores.", 2],
["Harriet Taylor Mill", 1807, 1858, 0, "Londres", "Feminismo", "feminismo politica", "«La emancipación de las mujeres» (1851); se discute cuánto de las ideas de John Stuart Mill, su marido, es también suyo.", 2],
["Ada Lovelace", 1815, 1852, 0, "Londres", "Matemática", "logica ciencia", "Vio que la máquina analítica podía manipular símbolos, no solo números.", 2],
["Concepción Arenal", 1820, 1893, 0, "Ferrol", "Reformismo social", "etica politica", "Inspectora de cárceles de mujeres y pionera del feminismo español: «La mujer del porvenir» (1869) y «Estudios penitenciarios».", 2],
["Savitribai Phule", 1831, 1897, 0, "Maharashtra, India", "Reforma social", "educacion politica feminismo", "Abrió escuelas para niñas y dalits; pensó la educación como liberación de la casta.", 2],
["Victoria Welby", 1837, 1912, 0, "Inglaterra", "Significs", "lenguaje conocimiento", "Inventó la «significs», una teoría del significado que dialogó con Peirce.", 1],
["Christine Ladd-Franklin", 1847, 1930, 0, "Connecticut", "Lógica", "logica mente", "Lógica simbólica (el «antilogismo») y teoría de la visión del color.", 1],
["Tarabai Shinde", 1850, 1910, 1, "Maharashtra, India", "Reforma social", "feminismo politica", "«Comparación entre mujeres y hombres»: crítica del patriarcado en la India.", 1],
["Pandita Ramabai", 1858, 1922, 0, "India", "Reforma social", "educacion feminismo", "Sabia del sánscrito que fundó escuelas y refugios para viudas.", 1],
["Anna Julia Cooper", 1858, 1964, 0, "Carolina del Norte", "Feminismo negro", "raza feminismo educacion", "«Una voz del Sur»: las mujeres negras como clave de la justicia.", 2],
["Jane Addams", 1860, 1935, 0, "Chicago", "Pragmatismo", "politica etica cuidado", "La democracia como forma de vida compartida; fundó Hull House.", 2],
["Charlotte Perkins Gilman", 1860, 1935, 0, "Hartford, Connecticut", "Feminismo", "economia feminismo", "«Mujeres y economía» (1898): la relación económica entre hombres y mujeres moldea la sociedad; reclama su independencia económica.", 1],
["Lou Andreas-Salomé", 1861, 1937, 0, "San Petersburgo / Gotinga", "Psicoanálisis", "psique existencia", "Pensó el erotismo y el narcisismo; interlocutora de Nietzsche, Rilke y Freud.", 2],
["Mary Whiton Calkins", 1863, 1930, 0, "Connecticut, EE. UU.", "Psicología del yo", "mente psique", "Psicología del yo («self»), influida por William James y Josiah Royce; primera mujer presidenta de la APA (1905).", 1],
["Emma Goldman", 1869, 1940, 0, "Kaunas (Lituania) / EE. UU.", "Anarquismo", "politica cuerpo feminismo", "Anarquista: defendió la libertad sexual como parte de la revolución y criticó el voto femenino como «fetiche».", 2],
["Rosa Luxemburgo", 1871, 1919, 0, "Polonia / Berlín", "Marxismo", "politica economia", "«La libertad es siempre la libertad de quien piensa diferente».", 3],
["Alexandra Kollontai", 1872, 1952, 0, "San Petersburgo", "Marxismo", "politica cuerpo feminismo", "Repensó el amor, la familia y la sexualidad desde el socialismo.", 2],
["Begum Rokeya", 1880, 1932, 0, "Bengala", "Reforma social", "feminismo educacion", "«El sueño de Sultana»: una utopía feminista donde los hombres viven recluidos.", 1],
["He-Yin Zhen", 1884, 1920, 1, "China / Tokio", "Anarcofeminismo", "feminismo politica economia", "Analizó el patriarcado chino junto con el capitalismo y el Estado.", 1],
["Susan Stebbing", 1885, 1943, 0, "Londres", "Filosofía analítica", "logica lenguaje", "«Pensar con propósito»: lógica para defenderse de la propaganda.", 1],
["Hiratsuka Raichō", 1886, 1971, 0, "Tokio", "Feminismo japonés", "feminismo existencia", "«En el principio la mujer era el sol»: fundó la revista Seitō.", 1],
["Hedwig Conrad-Martius", 1888, 1966, 0, "Alemania", "Fenomenología", "metafisica ciencia", "Fenomenología realista: ontología de la naturaleza y del ser vivo.", 1],
["Edith Stein", 1891, 1942, 0, "Breslavia", "Fenomenología", "existencia mistica mente", "«Sobre el problema de la empatía». Asesinada en Auschwitz.", 3],
["Dorothy Wrinch", 1894, 1976, 0, "Argentina / Inglaterra", "Lógica", "logica ciencia", "Del principio de inducción a la estructura de las proteínas.", 1],
["Susanne Langer", 1895, 1985, 0, "Nueva York", "Filosofía del símbolo", "estetica lenguaje mente", "«Nueva clave de la filosofía»: el arte como forma simbólica del sentir.", 2],
["Gerda Walther", 1897, 1977, 0, "Alemania", "Fenomenología", "mistica existencia", "Fenomenología de la comunidad y de la experiencia mística.", 1],
["Grete Hermann", 1901, 1984, 0, "Bremen", "Neokantismo", "ciencia logica etica", "Mostró un error en la prueba de von Neumann sobre la mecánica cuántica.", 1],
["María Zambrano", 1904, 1991, 0, "Vélez-Málaga", "Razón poética", "estetica mistica existencia", "La razón poética: un pensar que no separa la verdad del sentir.", 3],
["Rózsa Péter", 1905, 1977, 0, "Budapest", "Lógica", "logica", "Fundadora de la teoría de funciones recursivas.", 1],
["Hannah Arendt", 1906, 1975, 0, "Hannover / Nueva York", "Teoría política", "politica existencia", "La condición humana, la natalidad y la banalidad del mal.", 3],
["Simone de Beauvoir", 1908, 1986, 0, "París", "Existencialismo", "feminismo existencia cuerpo", "«No se nace mujer: se llega a serlo».", 3],
["Simone Weil", 1909, 1943, 0, "París", "Mística y política", "mistica politica etica", "La atención, el desarraigo y el trabajo: una mística de la justicia.", 3],
["Jeanne Hersch", 1910, 2000, 0, "Ginebra", "Existencialismo", "politica etica", "Libertad y derechos humanos como exigencia filosófica.", 1],
["Marjorie Grene", 1910, 2009, 0, "Milwaukee", "Filosofía de la biología", "ciencia conocimiento", "Fundó la filosofía de la biología contemporánea.", 1],
["Margaret Masterman", 1910, 1986, 0, "Cambridge", "Lingüística computacional", "lenguaje logica", "Pionera de la traducción automática y lectora crítica de Kuhn.", 1],
["Raya Dunayevskaya", 1910, 1987, 0, "Ucrania / EE. UU.", "Humanismo marxista", "politica economia", "Hegel, Marx y la liberación como proceso vivo.", 1],
["Elizabeth Anscombe", 1919, 2001, 0, "Oxford / Cambridge", "Filosofía analítica", "mente etica lenguaje", "«Intención» y el renacer de la ética de la virtud.", 3],
["Iris Murdoch", 1919, 1999, 0, "Dublín / Oxford", "Ética", "etica estetica", "«La soberanía del bien»: el amor como atención justa a la realidad.", 2],
["Mary Midgley", 1919, 2018, 0, "Londres / Newcastle", "Ética", "ciencia ecologia etica", "Los humanos como animales; crítica del cientifismo.", 2],
["Philippa Foot", 1920, 2010, 0, "Oxford", "Ética", "etica", "Planteó el dilema del tranvía y defendió un naturalismo moral.", 2],
["Ruth Barcan Marcus", 1921, 2012, 0, "Nueva York", "Lógica", "logica metafisica", "Lógica modal cuantificada y la necesidad de la identidad.", 2],
["Mary Warnock", 1924, 2019, 0, "Winchester", "Ética", "etica cuidado", "Bioética pública: embriones, educación especial.", 1],
["Mary Hesse", 1924, 2016, 0, "Inglaterra", "Filosofía de la ciencia", "ciencia lenguaje", "Modelos y analogías en la ciencia.", 1],
["Rosario Castellanos", 1925, 1974, 0, "Ciudad de México", "Feminismo mexicano", "feminismo estetica", "«Sobre cultura femenina»: por qué la cultura ha excluido a las mujeres.", 1],
["Graciela Hierro", 1928, 2003, 0, "Ciudad de México", "Ética feminista", "feminismo etica educacion", "Ética feminista del placer («La ética del placer») y filosofía de la educación con perspectiva de género, desde la UNAM.", 1],
["Mary Daly", 1928, 2010, 0, "Boston", "Teología feminista", "feminismo mistica lenguaje", "Más allá de Dios Padre: una teología feminista radical.", 1],
["Sylvia Wynter", 1928, null, 0, "Jamaica", "Pensamiento caribeño", "decolonial raza", "Desmontar el «Hombre» europeo como medida de lo humano.", 2],
["Agnes Heller", 1929, 2019, 0, "Budapest", "Escuela de Budapest", "politica etica", "La vida cotidiana y la teoría de las necesidades.", 2],
["Annette Baier", 1929, 2012, 0, "Nueva Zelanda", "Ética", "etica cuidado", "La confianza como centro de la vida moral; lectora de Hume.", 1],
["Judith Jarvis Thomson", 1929, 2020, 0, "Nueva York", "Ética", "etica cuerpo", "«Una defensa del aborto» y el violinista inconsciente.", 2],
["Nel Noddings", 1929, 2022, 0, "Nueva Jersey", "Ética del cuidado", "cuidado educacion", "El cuidado como base de la ética y la educación.", 1],
["Luce Irigaray", 1930, null, 0, "Bélgica / París", "Diferencia sexual", "feminismo lenguaje psique", "«Espéculo de la otra mujer»: la diferencia sexual como cuestión filosófica.", 2],
["Nawal El Saadawi", 1931, 2021, 0, "Egipto", "Feminismo árabe", "feminismo cuerpo politica", "Medicina, cuerpo y política contra el patriarcado.", 1],
["Carla Lonzi", 1931, 1982, 0, "Florencia", "Feminismo de la diferencia", "feminismo politica", "«Escupamos sobre Hegel».", 1],
["Ruth Millikan", 1933, null, 0, "Connecticut", "Filosofía de la mente", "mente lenguaje ciencia", "Teleosemántica: el significado como función biológica.", 1],
["Audre Lorde", 1934, 1992, 0, "Nueva York", "Feminismo negro", "raza feminismo estetica", "«Las herramientas del amo nunca desmontarán la casa del amo».", 2],
["Kate Millett", 1934, 2017, 0, "Minnesota", "Feminismo radical", "feminismo politica", "«Política sexual»: el patriarcado como sistema político.", 1],
["Sarah Kofman", 1934, 1994, 0, "París", "Deconstrucción", "psique estetica", "Lecturas de Nietzsche y Freud, y la escritura después de Auschwitz.", 1],
["Monique Wittig", 1935, 2003, 0, "Francia", "Feminismo materialista", "feminismo lenguaje politica", "«El pensamiento heterosexual»: las lesbianas no son mujeres.", 2],
["Sophie Oluwole", 1935, 2018, 0, "Nigeria", "Filosofía africana", "etica metafisica", "Recuperó a Orunmila y la filosofía yoruba frente a Sócrates.", 1],
["Lélia Gonzalez", 1935, 1994, 0, "Brasil", "Feminismo negro", "raza decolonial feminismo", "La «amefricanidad» y el racismo como neurosis cultural brasileña.", 2],
["Sandra Harding", 1935, 2025, 0, "Estados Unidos", "Epistemología feminista", "conocimiento ciencia feminismo", "Teoría del punto de vista y «objetividad fuerte».", 1],
["Sara Ruddick", 1935, 2011, 0, "Nueva York", "Ética del cuidado", "cuidado etica", "El «pensamiento maternal» como práctica filosófica que lleva a una política de paz.", 1],
["Margaret Boden", 1936, 2025, 0, "Londres", "Ciencia cognitiva", "mente ciencia", "Creatividad e inteligencia artificial.", 1],
["Carol Gilligan", 1936, null, 0, "Nueva York", "Ética del cuidado", "cuidado etica", "«Con otra voz»: la ética del cuidado frente a la de la justicia.", 2],
["Carolyn Merchant", 1936, null, 0, "Estados Unidos", "Ecofeminismo", "ecologia ciencia", "«La muerte de la naturaleza»: revolución científica y dominio.", 1],
["Evelyn Fox Keller", 1936, 2023, 0, "Nueva York", "Ciencia y género", "ciencia feminismo", "Género y ciencia; biografía de Barbara McClintock.", 1],
["Julieta Kirkwood", 1936, 1985, 0, "Chile", "Feminismo latinoamericano", "feminismo politica", "«Ser política en Chile»: el feminismo frente a la dictadura.", 1],
["Cora Diamond", 1937, null, 0, "Nueva York", "Filosofía analítica", "lenguaje etica", "Wittgenstein, el espíritu realista y los animales.", 1],
["Hélène Cixous", 1937, null, 0, "Orán / París", "Escritura femenina", "estetica cuerpo psique", "«La risa de la medusa»: escribir el cuerpo.", 2],
["Lorraine Code", 1937, null, 0, "Canadá", "Epistemología feminista", "conocimiento feminismo", "¿Importa el sexo de quien conoce?", 1],
["Val Plumwood", 1939, 2008, 0, "Australia", "Ecofeminismo", "ecologia feminismo", "Crítica del dualismo razón/naturaleza; sobrevivió al ataque de un cocodrilo.", 1],
["Luisa Muraro", 1940, 2026, 0, "Italia", "Feminismo de la diferencia", "feminismo lenguaje", "«El orden simbólico de la madre».", 1],
["Carole Pateman", 1940, null, 0, "Inglaterra", "Teoría política", "politica feminismo", "«El contrato sexual» oculto bajo el contrato social.", 2],
["Fatema Mernissi", 1940, 2015, 0, "Fez", "Feminismo islámico", "feminismo politica", "Islam, género y la memoria de las mujeres en el poder.", 2],
["Onora O'Neill", 1941, null, 0, "Irlanda del Norte", "Kantismo", "etica politica", "Justicia, confianza y deberes globales.", 1],
["Julia Kristeva", 1941, null, 0, "Bulgaria / París", "Semiótica y psicoanálisis", "lenguaje psique estetica", "Lo semiótico, lo abyecto, la extranjeridad.", 2],
["Victoria Camps", 1941, null, 0, "Barcelona", "Ética", "etica politica", "Virtudes públicas y la ética del buen gobierno.", 1],
["Genevieve Lloyd", 1941, null, 0, "Australia", "Historia de la filosofía", "feminismo conocimiento", "«The Man of Reason»: cómo la filosofía pensó la razón en masculino.", 1],
["Marilyn Frye", 1941, null, 0, "Estados Unidos", "Feminismo", "feminismo politica", "La opresión como jaula de pájaro: barrotes que solo se ven juntos.", 1],
["Gayatri Spivak", 1942, null, 0, "Calcuta / Nueva York", "Poscolonialismo", "decolonial lenguaje", "«¿Puede hablar el subalterno?»", 3],
["Silvia Federici", 1942, null, 0, "Parma / Nueva York", "Feminismo marxista", "economia feminismo cuerpo", "«Calibán y la bruja»: caza de brujas y nacimiento del capitalismo.", 2],
["Gloria Anzaldúa", 1942, 2004, 0, "Texas", "Pensamiento chicano", "decolonial cuerpo estetica", "«Borderlands/La Frontera»: la conciencia mestiza.", 2],
["Alison Jaggar", 1942, null, 0, "Inglaterra / EE. UU.", "Ética feminista", "feminismo etica", "Emoción y conocimiento en la epistemología feminista.", 1],
["Patricia Churchland", 1943, null, 0, "Canadá", "Neurofilosofía", "mente ciencia", "La mente se estudia mejor desde el cerebro.", 1],
["Chantal Mouffe", 1943, null, 0, "Bélgica", "Teoría política", "politica", "Democracia agonística y populismo de izquierda.", 2],
["Angela Davis", 1944, null, 0, "Alabama", "Marxismo y feminismo negro", "raza politica feminismo", "«Mujeres, raza y clase» y el abolicionismo de las prisiones.", 3],
["Donna Haraway", 1944, null, 0, "Denver", "Estudios de la ciencia", "ciencia feminismo ecologia", "«Manifiesto cíborg» y los conocimientos situados.", 3],
["María Lugones", 1944, 2020, 0, "Argentina / EE. UU.", "Feminismo decolonial", "decolonial feminismo", "La colonialidad del género.", 2],
["Celia Amorós", 1944, null, 0, "Valencia", "Feminismo ilustrado", "feminismo politica", "Hacia una crítica de la razón patriarcal.", 2],
["Nancy Cartwright", 1944, null, 0, "Pensilvania", "Filosofía de la ciencia", "ciencia", "«Cómo mienten las leyes de la física».", 1],
["Helen Longino", 1944, null, 0, "Estados Unidos", "Filosofía de la ciencia", "ciencia conocimiento", "La ciencia como conocimiento social.", 1],
["Susan Haack", 1945, 2026, 0, "Inglaterra", "Epistemología", "conocimiento logica", "«Fundherentismo» y filosofía de las lógicas.", 1],
["Shulamith Firestone", 1945, 2012, 0, "Ottawa / Nueva York", "Feminismo radical", "feminismo cuerpo", "«La dialéctica del sexo».", 1],
["Elizabeth Spelman", 1945, null, 0, "Estados Unidos", "Feminismo", "feminismo raza", "«La mujer inesencial»: ¿qué mujer es «la mujer»?", 1],
["Catharine MacKinnon", 1946, null, 0, "Minnesota", "Derecho feminista", "feminismo politica", "Acoso sexual como discriminación; feminismo de la dominación.", 2],
["Susan Moller Okin", 1946, 2004, 0, "Nueva Zelanda", "Teoría política", "politica feminismo", "Justicia, género y familia.", 1],
["Eva Feder Kittay", 1946, null, 0, "Ginebra / EE. UU.", "Ética del cuidado", "cuidado cuerpo", "Discapacidad, dependencia y la dignidad del cuidado.", 1],
["Martha Nussbaum", 1947, null, 0, "Nueva York", "Ética", "etica politica estetica", "Enfoque de las capacidades y la inteligencia de las emociones.", 3],
["Nancy Fraser", 1947, null, 0, "Baltimore", "Teoría crítica", "politica economia feminismo", "Redistribución y reconocimiento.", 2],
["Adela Cortina", 1947, null, 0, "Valencia", "Ética discursiva", "etica politica", "Ética cívica y la «aporofobia», el rechazo al pobre.", 2],
["Adriana Cavarero", 1947, null, 0, "Italia", "Feminismo de la diferencia", "feminismo existencia", "Narración, voz y unicidad.", 1],
["Barbara Cassin", 1947, null, 0, "París", "Filología filosófica", "lenguaje", "Los sofistas y el «Vocabulario de los intraducibles».", 1],
["Gillian Rose", 1947, 1995, 0, "Londres", "Hegelianismo", "politica existencia", "«Love's Work»: el amor, el duelo y la filosofía como trabajo; también una lectura crítica de Hegel y Adorno.", 1],
["Patricia Hill Collins", 1948, null, 0, "Filadelfia", "Feminismo negro", "raza feminismo conocimiento", "Pensamiento feminista negro y matriz de dominación.", 2],
["Michèle Le Dœuff", 1948, null, 0, "Francia", "Feminismo", "conocimiento feminismo", "El imaginario filosófico y la elección de Hipparchia.", 1],
["Isabelle Stengers", 1949, null, 0, "Bélgica", "Filosofía de la ciencia", "ciencia ecologia", "Cosmopolíticas y la intrusión de Gaia.", 2],
["Iris Marion Young", 1949, 2006, 0, "Nueva York", "Teoría política", "politica cuerpo", "«Lanzar como una chica» y la justicia de la diferencia.", 2],
["Silvia Rivera Cusicanqui", 1949, null, 0, "La Paz", "Pensamiento andino", "decolonial politica", "Lo «ch'ixi»: convivir sin fundirse.", 2],
["Seyla Benhabib", 1950, null, 0, "Estambul", "Teoría crítica", "politica etica", "Universalismo interactivo y derechos de los otros.", 1],
["Amelia Valcárcel", 1950, null, 0, "Madrid", "Feminismo ilustrado", "feminismo politica", "El derecho al mal y la herencia ilustrada del feminismo.", 2],
["Sueli Carneiro", 1950, null, 0, "São Paulo", "Feminismo negro", "raza decolonial conocimiento", "El epistemicidio: matar formas de saber.", 1],
["Rita Segato", 1951, null, 0, "Buenos Aires", "Antropología feminista", "feminismo decolonial politica", "«Las estructuras elementales de la violencia» y «La guerra contra las mujeres»: la violación como mandato de masculinidad, un acto dirigido a los otros hombres; los cuerpos de las mujeres como territorio de la guerra y la colonialidad.", 2],
["bell hooks", 1952, 2021, 0, "Kentucky", "Feminismo negro", "raza feminismo educacion", "Pedagogía transgresora y el amor como práctica política.", 3],
["Christine Korsgaard", 1952, null, 0, "Chicago", "Kantismo", "etica", "Las fuentes de la normatividad y nuestras obligaciones con los animales.", 1],
["Joan Tronto", 1952, null, 0, "Estados Unidos", "Ética del cuidado", "cuidado politica", "El cuidado como cuestión democrática.", 1],
["Vandana Shiva", 1952, null, 0, "Dehradun", "Ecofeminismo", "ecologia decolonial", "Semillas, biodiversidad y crítica del desarrollo.", 2],
["Susan Wolf", 1952, null, 0, "Estados Unidos", "Ética", "etica existencia", "El sentido de la vida y los «santos morales».", 1],
["Elizabeth Grosz", 1952, null, 0, "Sídney", "Feminismo corporal", "cuerpo metafisica", "«Cuerpos volátiles».", 1],
["Diana Maffía", 1953, null, 0, "Buenos Aires", "Epistemología feminista", "conocimiento feminismo", "Epistemología feminista y derechos en Argentina.", 1],
["Rosi Braidotti", 1954, null, 0, "Italia / Utrecht", "Posthumanismo", "cuerpo ecologia feminismo", "Sujetos nómades y lo posthumano.", 2],
["Chandra T. Mohanty", 1955, null, 0, "Bombay / EE. UU.", "Feminismo transnacional", "decolonial feminismo", "«Bajo los ojos de Occidente».", 1],
["Linda Martín Alcoff", 1955, null, 0, "Panamá / EE. UU.", "Epistemología", "raza conocimiento", "Identidades visibles y el problema de hablar por otros.", 1],
["Sally Haslanger", 1955, null, 0, "Estados Unidos", "Metafísica social", "metafisica feminismo raza", "Género y raza como construcciones sociales reales.", 1],
["Wendy Brown", 1955, null, 0, "California", "Teoría política", "politica economia", "El neoliberalismo deshace la democracia.", 1],
["Judith Butler", 1956, null, 0, "Cleveland", "Teoría queer", "feminismo cuerpo lenguaje", "El género como performatividad; vidas vulnerables.", 3],
["Karen Barad", 1956, null, 0, "Estados Unidos", "Nuevos materialismos", "ciencia metafisica", "Realismo agencial: la materia como intra-acción.", 1],
["Francesca Gargallo", 1956, 2022, 0, "Siracusa / México", "Feminismos de Abya Yala", "decolonial feminismo", "Ideas feministas de las mujeres de pueblos originarios.", 1],
["Jane Bennett", 1957, null, 0, "Estados Unidos", "Nuevos materialismos", "ecologia metafisica", "«Materia vibrante».", 1],
["Uma Narayan", 1958, null, 0, "India / EE. UU.", "Feminismo poscolonial", "decolonial feminismo", "«Descolonizar culturas».", 1],
["Kimberlé Crenshaw", 1959, null, 0, "Ohio", "Teoría crítica de la raza", "raza feminismo politica", "Acuñó la «interseccionalidad».", 2],
["Elizabeth Anderson", 1959, null, 0, "Estados Unidos", "Teoría política", "politica economia", "Igualdad democrática y el gobierno privado en el trabajo.", 1],
["Catherine Malabou", 1959, null, 0, "Francia", "Filosofía continental", "mente metafisica", "La plasticidad del cerebro y del ser.", 1],
["Rae Langton", 1961, null, 0, "India / Cambridge", "Filosofía analítica", "lenguaje feminismo", "Actos de habla, silenciamiento y pornografía.", 1],
["Saba Mahmood", 1961, 2018, 0, "Pakistán / Berkeley", "Antropología", "politica decolonial", "«La política de la piedad»: agencia más allá de la resistencia.", 1],
["Ochy Curiel", 1963, null, 0, "República Dominicana", "Feminismo decolonial", "decolonial feminismo raza", "Lesbofeminismo decolonial y antirracista.", 1],
["Miranda Fricker", 1966, null, 0, "Inglaterra", "Epistemología", "conocimiento etica", "Injusticia epistémica: testimonial y hermenéutica.", 2],
["Rahel Jaeggi", 1967, null, 0, "Berlín", "Teoría crítica", "politica existencia", "Alienación y crítica de las formas de vida.", 1],
["Yuderkys Espinosa", 1967, null, 1, "República Dominicana", "Feminismo decolonial", "decolonial feminismo", "Crítica del feminismo blanco desde Abya Yala.", 1],
["Sara Ahmed", 1969, null, 0, "Inglaterra / Australia", "Fenomenología queer", "cuerpo feminismo existencia", "Fenomenología queer, felicidad y la «aguafiestas feminista».", 2],
["Marina Garcés", 1973, null, 0, "Barcelona", "Filosofía política", "politica existencia", "Un mundo común y la nueva ilustración radical.", 2],
["Remedios Zafra", 1973, null, 0, "Zuheros", "Filosofía de la cultura", "estetica economia", "«El entusiasmo»: precariedad y trabajo creativo en la era digital.", 1],
["Lorena Cabnal", 1973, null, 1, "Guatemala", "Feminismo comunitario", "decolonial cuerpo ecologia", "Cuerpo-territorio: defender la tierra es defender el cuerpo.", 1],
["Elsa Dorlin", 1974, null, 0, "Francia", "Feminismo", "cuerpo politica raza", "«Defenderse»: una filosofía de la violencia.", 1],
["Djamila Ribeiro", 1980, null, 0, "Santos", "Feminismo negro", "raza feminismo", "El «lugar de enunciación».", 1],
["Kate Manne", 1983, null, 0, "Australia", "Filosofía analítica", "feminismo etica", "«Down Girl»: la misoginia como sistema que vigila y castiga a las mujeres.", 1],
["Amia Srinivasan", 1984, null, 0, "Baréin / Oxford", "Filosofía analítica", "feminismo politica conocimiento", "«El derecho al sexo».", 1],
["Cleobulina de Rodas", -550, "?", 1, "Rodas", "Sabiduría griega arcaica", "lenguaje logica", "Hija de Cleóbulo de Lindos, uno de los Siete Sabios; famosa por sus enigmas en hexámetros.", 1],
["Damo de Crotona", -535, -475, 1, "Crotona", "Pitagorismo", "conocimiento etica", "Hija de Pitágoras según la tradición; una historia cuenta que custodió sus escritos y se negó a venderlos.", 1],
["Mía de Crotona", -500, "?", 1, "Crotona", "Pitagorismo", "etica cuidado", "Pitagórica a quien se atribuye una carta sobre la armonía en el cuidado de los recién nacidos.", 1],
["Esara de Lucania", -350, "?", 1, "Lucania", "Pitagorismo", "etica mente", "«Sobre la naturaleza humana»: el alma en tres partes como modelo de la justicia en la casa y la ciudad.", 1],
["Fintis", -300, "?", 1, "Crotona", "Pitagorismo", "etica cuerpo", "Según Estobeo, escribió que la moderación es la virtud propia de la mujer; su autoría pitagórica es discutida.", 1],
["Axiotea de Fliunte", -350, "?", 1, "Fliunte / Atenas", "Academia platónica", "metafisica conocimiento", "Viajó a Atenas para estudiar en la Academia tras leer la República de Platón.", 1],
["Asclepigenia", 430, "?", 1, "Atenas", "Neoplatonismo", "mistica metafisica", "Enseñó en la escuela neoplatónica de Atenas y transmitió a Proclo los ritos teúrgicos.", 1],
["Ptolemaida de Cirene", -250, "?", 1, "Cirene", "Teoría musical", "estetica ciencia", "Comparó las escuelas pitagórica y aristoxénica: ¿se juzga la armonía con la razón o con el oído?", 1],
["Edesia de Alejandría", 410, 480, 1, "Alejandría", "Neoplatonismo", "etica educacion", "Neoplatónica alejandrina del siglo V, esposa de Hermias; Damascio la elogió como «la mejor y más bella de las mujeres de Alejandría».", 1],
["Perpetua", 182, 203, 1, "Cartago", "Cristianismo antiguo", "existencia mistica cuerpo", "Mártir de Cartago; escribió en prisión un relato en primera persona que se conserva en la «Pasión de Perpetua y Felicidad».", 1],
["Fátima al-Fihri", 800, 880, 1, "Cairuán (Túnez) / Fez (Marruecos)", "Islam medieval", "educacion", "Según la tradición, fundó en Fez la mezquita-escuela de al-Qarawiyyin, una de las instituciones de enseñanza más antiguas del mundo.", 2],
["Walatta Petros", 1592, 1642, 1, "Etiopía", "Cristianismo etíope", "politica mistica", "Santa etíope que lideró la resistencia a la imposición del catolicismo y fundó comunidades religiosas; su vida se escribió en 1672.", 1],
["Kimpa Vita", 1684, 1706, 0, "Reino del Congo", "Movimiento antoniano", "decolonial mistica politica", "Profeta congoleña que africanizó el cristianismo y quiso reunificar su reino. Fue quemada.", 1],
["Nana Asma'u", 1793, 1864, 0, "Califato de Sokoto, Nigeria", "Erudición islámica", "educacion mistica", "Poeta y erudita que creó una red de maestras para educar a las mujeres.", 2],
["Olive Schreiner", 1855, 1920, 0, "Sudáfrica", "Feminismo", "feminismo economia", "«La mujer y el trabajo»: contra el parasitismo al que se condena a las mujeres.", 1],
["Adelaide Casely-Hayford", 1868, 1960, 0, "Sierra Leona", "Panafricanismo", "educacion decolonial", "Fundó una escuela para niñas que valoraba la cultura africana frente al modelo colonial.", 1],
["Charlotte Maxeke", 1871, 1939, 1, "Sudáfrica", "Panafricanismo", "raza politica educacion", "Primera sudafricana negra licenciada; luchó contra las leyes de pases.", 1],
["Huda Shaarawi", 1879, 1947, 0, "Egipto", "Feminismo árabe", "feminismo politica", "Se quitó el velo en público en 1923 y fundó la Unión Feminista Egipcia.", 2],
["Malak Hifni Nasif", 1886, 1918, 0, "Egipto", "Feminismo árabe", "feminismo educacion", "Bajo el nombre de Bahithat al-Badiya defendió la educación de las mujeres egipcias.", 1],
["Funmilayo Ransome-Kuti", 1900, 1978, 0, "Nigeria", "Anticolonialismo", "politica feminismo decolonial", "Organizó a las mujeres de Abeokuta contra los impuestos coloniales.", 1],
["Leila Ahmed", 1940, null, 0, "Egipto / EE. UU.", "Feminismo islámico", "feminismo decolonial", "«Mujeres y género en el islam»: historia de los debates sobre el velo y el poder.", 1],
["Wangari Maathai", 1940, 2011, 0, "Kenia", "Ecología política", "ecologia politica", "El Movimiento Cinturón Verde: plantar árboles como forma de democracia.", 2],
["Molara Ogundipe-Leslie", 1940, 2019, 0, "Nigeria", "Feminismo africano", "feminismo decolonial", "Acuñó el «stiwanismo»: la transformación social que incluye a las mujeres africanas.", 1],
["Ifi Amadiume", 1947, null, 0, "Nigeria", "Antropología feminista", "feminismo decolonial", "«Hijas varones, maridos mujeres»: el género igbo no encaja en las categorías occidentales.", 1],
["Mamphela Ramphele", 1947, null, 0, "Sudáfrica", "Conciencia Negra", "raza politica", "Médica y pensadora del movimiento de la Conciencia Negra junto a Steve Biko.", 1],
["Awa Thiam", 1950, null, 1, "Senegal", "Feminismo africano", "feminismo cuerpo", "«La palabra a las negras»: las mujeres africanas hablan en primera persona.", 1],
["Catherine Acholonu", 1951, 2014, 0, "Nigeria", "Feminismo africano", "feminismo ecologia", "El «motherism»: una alternativa afrocéntrica al feminismo.", 1],
["Amina Mama", 1958, null, 0, "Nigeria", "Feminismo africano", "feminismo raza", "Identidad, subjetividad y militarismo desde los estudios africanos de género.", 1],
["Sylvia Tamale", 1967, null, 1, "Uganda", "Afrofeminismo", "decolonial feminismo cuerpo", "«Descolonización y afrofeminismo»: derecho, sexualidad y colonialidad.", 1],
["Úrsula de Jesús", 1604, 1666, 0, "Lima, Perú", "Mística afroperuana", "mistica raza", "Mística afroperuana que dejó un diario de visiones sobre las almas del purgatorio.", 1],
["Madre Castillo", 1671, 1742, 0, "Tunja, Colombia", "Mística barroca", "mistica estetica", "Francisca Josefa del Castillo: «Afectos espirituales» y su autobiografía.", 1],
["Nísia Floresta", 1810, 1885, 0, "Brasil", "Feminismo", "feminismo educacion", "Pionera del feminismo brasileño, defendió la educación de las niñas.", 1],
["Juana Manso", 1819, 1875, 0, "Buenos Aires", "Generación del 37", "educacion feminismo", "Maestra y escritora: impulsó la coeducación en Argentina y fundó en Brasil «O Jornal das Senhoras», periódico pionero para mujeres.", 1],
["Paulina Luisi", 1875, 1950, 0, "Uruguay", "Feminismo", "feminismo politica cuerpo", "Primera médica uruguaya; sufragio y educación sexual.", 1],
["Dolores Cacuango", 1881, 1971, 0, "Ecuador", "Movimiento indígena", "decolonial educacion politica", "Fundó escuelas bilingües quichua-castellano en Ecuador.", 1],
["Alicia Moreau de Justo", 1885, 1986, 0, "Buenos Aires", "Socialismo", "politica feminismo", "Médica socialista y feminista; luchó por el voto de las mujeres en Argentina.", 1],
["Teresa de la Parra", 1889, 1936, 0, "Caracas", "Ensayo latinoamericano", "feminismo estetica", "Conferencias sobre la influencia de las mujeres en la formación del alma americana.", 1],
["Victoria Ocampo", 1890, 1979, 0, "Buenos Aires", "Ensayo", "estetica feminismo", "Fundó la revista Sur, puente entre el pensamiento europeo y el latinoamericano.", 2],
["Heleieth Saffioti", 1934, 2010, 0, "Brasil", "Feminismo marxista", "economia feminismo", "«La mujer en la sociedad de clases»: patriarcado y capitalismo en Brasil.", 1],
["Domitila Barrios de Chungara", 1937, 2012, 0, "Bolivia", "Movimiento obrero", "politica feminismo economia", "«Si me permiten hablar»: una mujer de las minas bolivianas.", 1],
["Josefina Ludmer", 1939, 2016, 0, "Argentina", "Crítica cultural", "lenguaje feminismo", "«Las tretas del débil»: leer a Sor Juana como estrategia de quien no puede hablar.", 1],
["Marilena Chaui", 1941, null, 0, "Brasil", "Filosofía política", "politica metafisica", "Espinosa y el autoritarismo en la sociedad brasileña.", 1],
["Beatriz Nascimento", 1942, 1995, 0, "Brasil", "Pensamiento negro", "raza decolonial", "El quilombo como forma de vida y de resistencia negra.", 1],
["Ofelia Schutte", 1945, null, 0, "Cuba / EE. UU.", "Filosofía latinoamericana", "decolonial feminismo", "Identidad cultural y liberación en el pensamiento latinoamericano.", 1],
["Marcela Lagarde", 1948, null, 0, "México", "Antropología feminista", "feminismo politica", "«Los cautiverios de las mujeres» y el concepto de feminicidio.", 2],
["Suely Rolnik", 1948, null, 0, "Brasil", "Esquizoanálisis", "psique politica estetica", "Las esferas de la insurrección: descolonizar el inconsciente.", 1],
["Nelly Richard", 1948, null, 0, "Caen / Santiago de Chile", "Crítica cultural", "estetica politica", "Arte, memoria y feminismo en el Chile de la dictadura y la transición.", 1],
["Rigoberta Menchú", 1959, null, 0, "Guatemala", "Movimiento indígena", "decolonial politica", "Testimonio maya k'iche' contra el genocidio; Nobel de la Paz.", 2],
["Maristella Svampa", 1961, null, 0, "Argentina", "Ecología política", "ecologia politica economia", "El «consenso de los commodities» y el extractivismo.", 1],
["Raquel Gutiérrez Aguilar", 1962, null, 0, "México / Bolivia", "Comunitarismo", "politica decolonial", "Horizontes comunitario-populares y lo común.", 1],
["Lohana Berkins", 1965, 2016, 0, "Argentina", "Teoría travesti", "cuerpo politica feminismo", "Activista y pensadora travesti: la identidad como lucha política.", 1],
["Julieta Paredes", 1967, null, 1, "Bolivia", "Feminismo comunitario", "decolonial feminismo cuerpo", "Feminismo comunitario aymara: el entronque patriarcal.", 1],
["Verónica Gago", 1976, null, 0, "Argentina", "Feminismo", "feminismo economia politica", "«La potencia feminista»: la huelga y la deuda.", 1],
["Yásnaya Elena Aguilar", 1981, null, 0, "Oaxaca, México", "Pensamiento mixe", "lenguaje decolonial", "Lenguas indígenas, Estado-nación y el derecho a existir en otra lengua.", 1],
["Lopamudra", -1200, "?", 1, "India", "Rig Veda", "cuerpo mistica", "Se le atribuye un himno del Rig Veda (1.179) en el que pide amor y atención a su esposo, el asceta Agastia.", 1],
["Mahapajapati Gotami", -600, "?", 1, "India", "Budismo", "mistica etica", "Tía y madrastra del Buda, y primera mujer ordenada monja (bhikkhuni) en la comunidad budista.", 1],
["Kisa Gotami", -500, "?", 1, "Shravasti, India", "Budismo", "existencia mistica", "El grano de mostaza: no hay casa donde no haya entrado la muerte.", 1],
["Sulabha", -400, "?", 1, "India", "Mahabharata", "metafisica logica", "En el Mahabharata debate con el rey Janaka y desmonta su pretensión de estar liberado.", 1],
["Avvaiyar", -100, "?", 1, "Tamil Nadu, India", "Sabiduría tamil", "etica educacion", "Nombre de varias poetas sabias tamiles: la más antigua vivió hacia el siglo I a. C.; a una Avvaiyar posterior se atribuyen aforismos éticos muy populares.", 1],
["Julia Domna", 160, 217, 1, "Emesa, Siria / Roma", "Filosofía imperial", "politica conocimiento", "Emperatriz romana, estudiosa de la filosofía; animó a Filóstrato a escribir la «Vida de Apolonio de Tiana».", 1],
["Xie Daoyun", 340, 399, 1, "China", "Taoísmo y confucianismo", "metafisica estetica", "Poeta y filósofa de la dinastía Jin, con influencias taoístas y confucianas; invencible en los debates de su familia.", 1],
["Karaikkal Ammaiyar", 450, "?", 1, "Karaikal, India del Sur", "Bhakti shaiva", "mistica cuerpo", "Una de las primeras poetas bhakti tamiles (siglo V): se describió a sí misma con aspecto de espectro, entregada por completo a Shiva.", 1],
["Andal", 700, "?", 1, "Tamil Nadu, India", "Bhakti vaishnava", "mistica estetica", "Única mujer entre los Alvar: la unión con Vishnu como amor nupcial.", 1],
["Yeshe Tsogyal", 757, 817, 1, "Tíbet", "Budismo tibetano", "mistica cuerpo", "Madre del budismo tibetano, maestra y guardiana de enseñanzas ocultas.", 1],
["Fátima de Nishapur", 800, 849, 1, "Nishapur, Persia", "Sufismo", "mistica", "Mística sufí a quien Dhu l-Nun llamó su maestra.", 1],
["Machig Labdrön", 1055, 1149, 1, "Tíbet", "Budismo tibetano", "mistica cuerpo", "Creó el Chöd: ofrecer el propio cuerpo para cortar el apego al yo.", 2],
["Muktabai", 1279, 1297, 1, "Maharashtra, India", "Bhakti varkari", "mistica existencia", "Santa varkari que en sus versos enseña a su hermano a soltar la ira.", 1],
["Im Yunjidang", 1721, 1793, 0, "Corea", "Neoconfucianismo", "etica metafisica", "Sostuvo que hombres y mujeres comparten la misma naturaleza y pueden llegar a ser sabios.", 1],
["Tadano Makuzu", 1763, 1825, 0, "Edo / Sendai, Japón", "Pensamiento Edo", "etica feminismo", "«Hitori kangae» (Pensamientos solitarios): opiniones poco convencionales sobre la economía de los samuráis y las relaciones entre hombres y mujeres.", 1],
["Wang Zhenyi", 1768, 1797, 0, "Jiangning (Nankín), China", "Ciencia Qing", "ciencia logica", "Astrónoma y matemática; explicó los eclipses y escribió para que otros entendieran el cálculo.", 1],
["Kang Jeongildang", 1772, 1832, 0, "Jecheon, Corea", "Poesía y erudición Joseon", "etica", "Poeta y erudita coreana de la dinastía Joseon.", 1],
["Táhirih", 1817, 1852, 1, "Qazvin, Irán", "Babismo", "mistica feminismo politica", "Teóloga y poeta persa que se quitó el velo en público. Fue ejecutada.", 2],
["Bibi Khanum Astarabadi", 1858, 1921, 1, "Irán", "Feminismo persa", "feminismo educacion", "«Los defectos de los hombres»: sátira contra un manual que enseñaba a someter a las mujeres.", 1],
["Zaynab Fawwaz", 1860, 1914, 1, "Tebnine (Líbano) / El Cairo", "Derechos de las mujeres", "feminismo educacion", "Escribió un diccionario biográfico de unas 450 mujeres célebres, «Perlas dispersas» (1894).", 1],
["Qiu Jin", 1875, 1907, 0, "China", "Revolución feminista", "politica feminismo", "Feminista y revolucionaria contra la dinastía Qing. Fue ejecutada.", 1],
["Yosano Akiko", 1878, 1942, 0, "Japón", "Feminismo japonés", "feminismo estetica", "Poeta y ensayista: independencia económica de las mujeres frente a la protección del Estado.", 1],
["Kartini", 1879, 1904, 0, "Java, Indonesia", "Emancipación", "educacion feminismo decolonial", "En sus cartas pide educación y libertad para las mujeres javanesas.", 2],
["Mai Ziadeh", 1886, 1941, 0, "Nazaret / El Cairo", "Nahda", "estetica feminismo", "Su salón reunió a los intelectuales árabes; escribió sobre la igualdad.", 1],
["Yamakawa Kikue", 1890, 1980, 0, "Japón", "Socialismo feminista", "economia feminismo", "Feminismo socialista: la opresión de las mujeres unida a la explotación.", 1],
["Na Hye-sok", 1896, 1948, 0, "Corea", "Feminismo coreano", "feminismo estetica", "Pintora y ensayista que denunció el doble rasero del matrimonio.", 1],
["Nazira Zeineddine", 1908, 1976, 0, "Líbano", "Feminismo islámico", "feminismo", "«Quitar el velo y el velo»: lectura del Corán contra la obligación del velo.", 1],
["Uma Chakravarti", 1941, null, 0, "India", "Historia feminista", "feminismo politica", "El «patriarcado brahmánico»: casta y género juntos.", 1],
["Kamla Bhasin", 1946, 2021, 0, "India", "Feminismo sudasiático", "feminismo politica", "Feminismo popular en el sur de Asia, con canciones y lemas.", 1],
["Chizuko Ueno", 1948, null, 0, "Japón", "Feminismo", "feminismo economia cuidado", "Patriarcado, capitalismo y cuidado en Japón.", 1],
["Asma Barlas", 1950, null, 0, "Pakistán / EE. UU.", "Hermenéutica feminista", "feminismo mistica", "Lectura del Corán contra el patriarcado.", 1],
["Li Xiaojiang", 1951, 2025, 0, "China", "Estudios de la mujer", "feminismo conocimiento", "Fundó los estudios de la mujer en la China posmaoísta.", 1],
["Germaine Greer", 1939, null, 0, "Melbourne, Australia", "Feminismo", "feminismo cuerpo", "«La mujer eunuco».", 2],
["Raewyn Connell", 1944, null, 0, "Australia", "Sociología", "feminismo decolonial", "Masculinidades y teoría desde el Sur.", 1],
["Haunani-Kay Trask", 1949, 2021, 0, "Hawái", "Soberanía hawaiana", "decolonial politica", "«From a Native Daughter»: la soberanía del pueblo kanaka maoli de Hawái, contra el colonialismo.", 1],
["Ngahuia Te Awekotuku", 1949, null, 0, "Aotearoa", "Pensamiento maorí", "decolonial cuerpo", "Activista y pensadora maorí lesbiana: el moko y el cuerpo.", 1],
["Linda Tuhiwai Smith", 1950, null, 0, "Aotearoa", "Pensamiento maorí", "decolonial conocimiento", "«A descolonizar las metodologías».", 2],
["Marilyn Waring", 1952, null, 0, "Aotearoa", "Economía feminista", "economia feminismo cuidado", "«If Women Counted»: el trabajo no remunerado de las mujeres, ausente del PIB.", 1],
["Moira Gatens", 1954, null, 0, "Australia", "Feminismo", "cuerpo metafisica", "«Imaginary Bodies»: el cuerpo, Spinoza y el feminismo.", 1],
["Aileen Moreton-Robinson", 1956, null, 0, "Australia", "Feminismo indígena", "raza decolonial", "«Talkin' Up to the White Woman»: feminismo indígena australiano frente al feminismo blanco.", 1],
["Teresia Teaiwa", 1968, 2017, 0, "Hawái / Fiyi", "Estudios del Pacífico", "decolonial politica", "Pensadora del Pacífico, de raíces en Kiribati: militarismo, colonialismo e identidad desde las islas.", 1],
["Margaret Fuller", 1810, 1850, 0, "Massachusetts", "Trascendentalismo", "feminismo existencia", "«La mujer en el siglo XIX».", 1],
["Elizabeth Cady Stanton", 1815, 1902, 0, "Johnstown, Nueva York", "Sufragismo", "politica feminismo", "Sufragista y abolicionista; participó en la Declaración de Seneca Falls (1848), arranque del movimiento por los derechos de la mujer.", 2],
["Ellen Key", 1849, 1926, 0, "Suecia", "Reforma social", "educacion cuidado", "«El siglo de los niños».", 1],
["Mary Parker Follett", 1868, 1933, 0, "Massachusetts", "Psicología social", "politica etica", "El «poder con» frente al «poder sobre».", 1],
["Maria Montessori", 1870, 1952, 0, "Italia", "Pedagogía", "educacion cuerpo", "La niña y el niño se educan a sí mismos en un entorno preparado.", 2],
["Grace de Laguna", 1878, 1978, 0, "Connecticut", "Filosofía del lenguaje", "lenguaje mente", "«Speech: Its Function and Evolution» (1927): el lenguaje entendido por su función en la vida social.", 1],
["Rachel Carson", 1907, 1964, 0, "Pensilvania", "Ecología", "ecologia ciencia", "«Primavera silenciosa».", 2],
["Yuriko Saito", 1953, null, 1, "Japón / EE. UU.", "Estética cotidiana", "estetica ecologia etica", "«Estética cotidiana»: lo bello y lo feo en lo que hacemos cada día —lavar, ordenar, reparar— tiene consecuencias éticas y ecológicas.", 2],
["Sei Shōnagon", 966, 1025, 1, "Kioto, Japón", "Literatura de corte Heian", "estetica existencia", "«El libro de la almohada»: listas de cosas que emocionan, que molestan o que no admiten comparación; una estética de lo cotidiano.", 2],
["Murasaki Shikibu", 973, 1014, 1, "Kioto, Japón", "Literatura de corte Heian", "estetica existencia psique", "«La historia de Genji»: la gran novela de la corte Heian, atravesada por el sentimiento budista de lo efímero.", 2],
["Vernon Lee", 1856, 1935, 0, "Francia / Florencia", "Estética", "estetica psique mente", "«Belleza y fealdad»: la empatía estética, sentir las formas con el propio cuerpo.", 1],
["Anni Albers", 1899, 1994, 0, "Berlín / EE. UU.", "Bauhaus", "estetica cuerpo", "«Sobre el tejer»: pensar con las manos y la materia en los oficios.", 1],
["Mary Mothersill", 1923, 2008, 0, "Nueva York", "Estética analítica", "estetica conocimiento", "«Beauty Restored»: defendió que la belleza merece volver al centro de la filosofía.", 1],
["Susan Sontag", 1933, 2004, 0, "Nueva York", "Ensayo", "estetica politica", "«Contra la interpretación» y «Notas sobre lo camp»: una erótica del arte en lugar de una hermenéutica.", 2],
["Ellen Dissanayake", 1992, null, 2, "Estados Unidos", "Estética evolutiva", "estetica cuerpo ciencia", "«Homo Aestheticus» (1992): el arte como «hacer especial» lo cotidiano, una necesidad humana.", 1],
["Elaine Scarry", 1946, null, 0, "Estados Unidos", "Estética", "estetica etica cuerpo", "«Sobre la belleza y ser justos»: la belleza nos entrena para la justicia.", 1],
["Carolyn Korsmeyer", 1950, null, 0, "Estados Unidos", "Estética", "estetica cuerpo", "«El sentido del gusto»: la comida y el gusto como asuntos filosóficos.", 1],
["Sianne Ngai", 1971, null, 0, "Estados Unidos", "Teoría estética", "estetica economia", "«Our Aesthetic Categories»: lo mono, lo chiflado y lo interesante como categorías estéticas del capitalismo tardío.", 1],
["Peggy Zeglin Brand", 1995, null, 2, "Estados Unidos", "Estética feminista", "estetica feminismo", "Coeditó con Carolyn Korsmeyer «Feminism and Tradition in Aesthetics» y después «Beauty Matters»: el canon estético revisado desde las mujeres.", 1],
["Emily Brady", 2003, null, 2, "Reino Unido / EE. UU.", "Estética ambiental", "estetica ecologia etica", "«Aesthetics of the Natural Environment»: apreciar la naturaleza con imaginación y respeto, no como un cuadro.", 1],
["Bonnie Mann", 1961, null, 0, "Estados Unidos", "Fenomenología feminista", "estetica feminismo ecologia", "«Women's Liberation and the Sublime»: lo sublime repensado desde el feminismo y la tierra; después, «Sovereign Masculinity».", 1],
["Katya Mandoki", 2007, null, 2, "México", "Estética de lo cotidiano", "estetica lenguaje politica", "«Everyday Aesthetics» (Prosaica): la estética de la vida diaria, de la cultura y las identidades sociales.", 1],
["Linda Nochlin", 1931, 2017, 0, "Nueva York", "Historia del arte feminista", "estetica feminismo", "«¿Por qué no ha habido grandes artistas mujeres?»: la pregunta estaba mal planteada; el problema son las instituciones.", 2],
["Lucy Lippard", 1937, null, 0, "Nueva York", "Crítica de arte", "estetica politica feminismo", "La desmaterialización del objeto artístico y el arte feminista y comprometido.", 1],
["Rosalind Krauss", 1941, null, 0, "Estados Unidos", "Teoría del arte", "estetica lenguaje", "La escultura en el campo expandido y la originalidad de la vanguardia.", 1],
["Laura Mulvey", 1941, null, 0, "Oxford / Londres", "Teoría fílmica feminista", "estetica psique feminismo", "«Placer visual y cine narrativo»: la mirada masculina.", 2],
["Janet Wolff", 1943, null, 0, "Mánchester", "Sociología del arte", "estetica feminismo politica", "«La producción social del arte» y la flâneuse invisible de la modernidad.", 1],
["Mieke Bal", 1946, null, 0, "Países Bajos", "Teoría cultural", "estetica lenguaje", "Narratología y conceptos viajeros entre el arte y las humanidades.", 1],
["Griselda Pollock", 1949, null, 0, "Sudáfrica / Leeds", "Historia del arte feminista", "estetica feminismo psique", "«Visión y diferencia»: feminismo, psicoanálisis y las historias del arte.", 1],
["Estrella de Diego", 1958, null, 0, "Madrid", "Teoría del arte", "estetica feminismo", "Arte, género e identidad: «El andrógino sexuado» y «Travesías por la incertidumbre».", 1],
["Amelia Jones", 1961, null, 0, "Estados Unidos", "Teoría de la performance", "estetica cuerpo feminismo", "«Body Art/Performing the Subject»: el cuerpo del artista como lugar del significado.", 1],
["Marina Núñez", 1966, null, 0, "Palencia", "Arte y pensamiento feminista", "estetica cuerpo ciencia", "Artista que piensa con imágenes: monstruas, cíborgs y cuerpos que desbordan la norma.", 1],
["Koyo Kouoh", 1967, 2025, 0, "Duala, Camerún / Dakar", "Comisariado", "estetica decolonial", "Comisaria que puso el arte africano en el centro: fundó RAW Material Company y dirigió el Zeitz MOCAA.", 2],
["Lygia Clark", 1920, 1988, 0, "Belo Horizonte, Brasil", "Neoconcretismo", "estetica cuerpo psique", "Del cuadro al cuerpo: objetos relacionales que solo existen cuando alguien los toca; el arte como experiencia y terapia.", 2],
["Marilyn Strathern", 1941, null, 0, "Inglaterra", "Antropología", "feminismo conocimiento decolonial", "«El género del don» y las «conexiones parciales»: pensar las relaciones antes que los individuos.", 2],
["Lynn Margulis", 1938, 2011, 0, "Chicago", "Biología y filosofía de la vida", "ciencia ecologia metafisica", "Simbiogénesis: la vida no avanza solo por competencia, sino por alianzas; coautora de la hipótesis Gaia.", 2],
["María Mallo", 1981, null, 0, "Madrid", "Arquitectura biomimética", "estetica ciencia ecologia", "Arquitecta que investiga las geometrías naturales: los radiolarios, organismos marinos de una sola célula, como modelo para joyas, muebles y arquitectura; une artesanía y fabricación digital.", 1],
["George Eliot", 1819, 1880, 0, "Inglaterra", "Realismo", "etica estetica existencia", "Novelista («Middlemarch») y traductora: vertió «La esencia del cristianismo» de Feuerbach y la «Ética» de Spinoza.", 2],
["Ayn Rand", 1905, 1982, 0, "San Petersburgo / EE. UU.", "Objetivismo", "politica etica economia", "Fundó el objetivismo: egoísmo racional y defensa radical del capitalismo, en ensayos y novelas como «La rebelión de Atlas».", 2],
["Isabelle de Charrière", 1740, 1805, 0, "Países Bajos / Suiza", "Ilustración", "feminismo etica educacion", "Escritora y compositora ilustrada; defendió la educación de las mujeres frente a quienes la creían fijada por la naturaleza.", 1],
["Cristina de Suecia", 1626, 1689, 0, "Suecia / Roma", "Librepensamiento", "conocimiento politica", "Reina que abdicó; mantuvo correspondencia filosófica con Descartes, al que invitó a su corte, y fundó academias en Roma.", 1],
["Annie Besant", 1847, 1933, 0, "Londres / India", "Teosofía y socialismo", "politica mistica cuerpo", "Socialista, defensora del control de la natalidad y teósofa; apoyó el autogobierno de la India.", 1],
["María Gaetana Agnesi", 1718, 1799, 0, "Milán", "Ilustración", "ciencia logica educacion", "Filósofa y matemática: publicó un célebre manual de cálculo y defendió de joven el derecho de las mujeres a estudiar.", 2],
["Helena Blavatsky", 1831, 1891, 0, "Ucrania / EE. UU.", "Teosofía", "mistica metafisica", "Cofundó la Sociedad Teosófica, que mezcló esoterismo occidental y tradiciones de la India.", 1],
["Clara de Asís", 1194, 1253, 0, "Asís", "Mística medieval", "mistica etica", "Fundó las clarisas con una regla de pobreza estricta: la primera regla monástica que se sabe escrita por una mujer.", 1],
["Sophie Germain", 1776, 1831, 0, "París", "Ciencia y filosofía", "ciencia logica", "Matemática autodidacta que firmó con nombre de hombre para que la tomaran en serio; escribió también sobre la unidad de ciencias y letras.", 1],
["Brígida de Suecia", 1303, 1373, 0, "Suecia", "Mística medieval", "mistica politica", "Visionaria que fundó la Orden del Santísimo Salvador; escribió al papa para que volviera a Roma y a los príncipes por la paz.", 1],
["Ingeborg Bachmann", 1926, 1973, 0, "Klagenfurt, Austria", "Literatura y filosofía", "lenguaje existencia estetica", "Poeta que se doctoró con una tesis crítica sobre Heidegger: el lenguaje y lo que no puede decirse.", 1],
["Madeleine de Scudéry", 1607, 1701, 0, "El Havre / París", "Preciosismo", "feminismo educacion lenguaje", "Novelista de salón: defendió la conversación como forma de pensar y la educación de las mujeres.", 1],
["Elena Cornaro Piscopia", 1646, 1684, 0, "Venecia", "Aristotelismo", "educacion conocimiento", "Primera mujer doctorada en una universidad: se graduó en filosofía en Padua en 1678.", 2],
["Ricarda Huch", 1864, 1947, 0, "Brunswick, Alemania", "Historia y Romanticismo", "estetica politica", "Historiadora y escritora; estudió el Romanticismo y se negó a colaborar con el nazismo.", 1],
["Voltairine de Cleyre", 1866, 1912, 0, "Estados Unidos", "Anarquismo", "politica feminismo", "Anarquista y feminista: un «anarquismo sin adjetivos» y la crítica de la «esclavitud sexual» dentro del matrimonio.", 1],
["María la Judía", 100, "?", 1, "Alejandría", "Alquimia", "ciencia metafisica", "Alquimista alejandrina a quien se atribuyen aparatos como el baño maría.", 1],
["Anandamayi Ma", 1896, 1982, 0, "Bengala, India", "Espiritualidad hindú", "mistica existencia", "Maestra espiritual bengalí, una de las grandes místicas de la India del siglo XX.", 1],
["Doria Shafik", 1908, 1975, 0, "Egipto", "Feminismo árabe", "feminismo politica", "Doctora en filosofía por la Sorbona; lideró la lucha por el voto de las mujeres egipcias.", 1],
["Etel Adnan", 1925, 2021, 0, "Beirut, Líbano", "Poesía y pintura", "estetica politica", "Poeta y pintora libanesa que estudió filosofía; escribió sobre la guerra y el paisaje.", 1],
["Élisabeth Badinter", 1944, null, 0, "Francia", "Feminismo ilustrado", "feminismo cuidado", "«¿Existe el amor maternal?»: el instinto maternal como construcción histórica.", 1],
["Antoinette Brown Blackwell", 1825, 1921, 0, "Estados Unidos", "Feminismo", "feminismo ciencia mistica", "Primera mujer ordenada ministra en EE. UU.; discutió con Darwin y Spencer sobre la igualdad de los sexos.", 1],
["Clémence Royer", 1830, 1902, 0, "Nantes", "Positivismo", "ciencia feminismo", "Primera traductora de Darwin al francés y defensora de la educación científica de las mujeres.", 1],
["Frances Power Cobbe", 1822, 1904, 0, "Dublín", "Ética victoriana", "etica cuidado feminismo", "Filósofa moral pionera de la protección de los animales y de los derechos de las mujeres.", 1],
["Moderata Fonte", 1555, 1592, 0, "Venecia", "Protofeminismo", "feminismo", "«El mérito de las mujeres»: un diálogo entre mujeres sobre la injusticia de los hombres.", 1],
["Lucrezia Marinella", 1571, 1653, 0, "Venecia", "Humanismo", "feminismo", "«La nobleza y excelencia de las mujeres»: respondió con argumentos filosóficos a un tratado misógino.", 1],
["Mary Everest Boole", 1832, 1916, 0, "Inglaterra", "Filosofía de la educación", "educacion logica", "Pensó cómo enseñar matemáticas y lógica desde el juego y la intuición.", 1],
["Shoshana Zuboff", 1951, null, 0, "Estados Unidos", "Teoría social", "economia politica", "«La era del capitalismo de la vigilancia»: nuestros datos convertidos en materia prima.", 1],
["Oodgeroo Noonuccal", 1920, 1993, 0, "Australia", "Pensamiento aborigen", "decolonial estetica", "Poeta y activista aborigen por los derechos de su pueblo.", 1],
["Karoline von Günderrode", 1780, 1806, 0, "Karlsruhe, Alemania", "Romanticismo", "estetica mistica existencia", "Poeta romántica alemana; sus temas fueron la libertad y la esclavitud, la vida y la muerte.", 1],
["Tanella Boni", 1954, 2026, 0, "Abiyán, Costa de Marfil", "Filosofía africana", "feminismo decolonial estetica", "Filósofa y poeta marfileña: el cuerpo, la condición de las mujeres africanas y la palabra.", 1],
["Frances Wright", 1795, 1852, 0, "Escocia / EE. UU.", "Librepensamiento", "politica feminismo educacion", "Librepensadora y abolicionista; defendió la educación igualitaria.", 1],
["Tullia d'Aragona", 1510, 1556, 0, "Roma", "Neoplatonismo amoroso", "etica estetica", "«Diálogo sobre la infinitud del amor» (1547): un amor honesto puede unir el deseo sensual y el espiritual.", 1],
["Helene Stöcker", 1869, 1943, 0, "Alemania", "Feminismo y pacifismo", "feminismo cuerpo politica", "Feminista y pacifista: una «nueva ética» de la sexualidad y la maternidad libres.", 1],
["María Skobtsova", 1891, 1945, 0, "Riga / París", "Pensamiento ortodoxo", "mistica etica politica", "Monja y pensadora que escondió a judíos en París; murió en Ravensbrück.", 1],
["Lea Ypi", 1979, null, 0, "Albania / Londres", "Filosofía política", "politica economia", "«Libre»: crecer en la Albania comunista y pensar qué significa la libertad.", 1],
["Anna Tumarkin", 1875, 1951, 0, "Chisináu / Berna", "Estética", "estetica conocimiento", "Una de las primeras catedráticas de Europa; estudió la estética y la historia de la filosofía suiza.", 1],
["Rosemary Radford Ruether", 1936, 2022, 0, "Estados Unidos", "Teología ecofeminista", "mistica ecologia feminismo", "Teología feminista y ecofeminista: «Gaia y Dios».", 1],
["Julia Annas", 1946, null, 0, "Inglaterra / EE. UU.", "Filosofía antigua", "etica", "Ética de la virtud y filosofía antigua: la felicidad como forma de vivir.", 1],
["Grace Lee Boggs", 1915, 2015, 0, "Estados Unidos", "Activismo", "politica raza", "Doctora en filosofía y activista en Detroit: la revolución como transformación de una misma y de la comunidad.", 1],
["Catharine Macaulay", 1731, 1791, 0, "Inglaterra", "Ilustración", "politica educacion feminismo", "Historiadora republicana: discutió con Burke e influyó en Wollstonecraft.", 1],
["Helene von Druskowitz", 1856, 1918, 0, "Viena", "Feminismo radical", "feminismo", "Una de las primeras doctoras en filosofía; crítica de Nietzsche y del patriarcado.", 1],
["Rebecca Goldstein", 1950, null, 0, "Nueva York", "Filosofía y novela", "logica metafisica", "Filosofía en forma de novela y ensayo: Spinoza, Gödel y la incompletitud.", 1],
["Khema", -550, "?", 1, "Sagala (hoy Sialkot, Pakistán)", "Budismo", "mistica conocimiento", "Monja budista a la que el Buda llamó la primera de sus discípulas en sabiduría.", 1],
["Ksenija Atanasijević", 1894, 1981, 0, "Belgrado", "Filosofía", "metafisica feminismo", "Primera mujer doctora en filosofía de Serbia; estudió a Giordano Bruno.", 1],
["Gadis Arivia", 1964, null, 0, "Indonesia", "Feminismo", "feminismo", "Filósofa feminista indonesia; fundó la revista Jurnal Perempuan.", 1],
["Ti-Grace Atkinson", 1938, null, 0, "Estados Unidos", "Feminismo radical", "feminismo politica", "Feminismo radical contra la institución del matrimonio.", 1],
["Jeanne Guyon", 1648, 1717, 0, "Montargis, Francia", "Quietismo", "mistica", "Mística del amor puro, heredera del quietismo de Molinos; estuvo presa en Vincennes y en la Bastilla (1695–1703).", 1],
["Madame de Lambert", 1647, 1733, 0, "París", "Salones", "educacion feminismo etica", "Ensayos sobre la educación de las mujeres y su dignidad moral.", 1],
["Brigitte Vasallo", 1973, null, 0, "Barcelona", "Feminismo", "feminismo cuerpo politica", "«Pensamiento monógamo, terror poliamoroso»: el amor y los vínculos como asunto político.", 1],
["Sofia Yanóvskaya", 1896, 1966, 0, "Unión Soviética", "Lógica", "logica ciencia", "Impulsó la lógica matemática y su historia en la Unión Soviética.", 1]
];

const WIKI={"Beatriz de Nazaret":"Beatriz_de_Nazaret","Gertrudis de Helfta":"Gertrudis_Magna","Ángela de Foligno":"Ángela_de_Foligno","Margery Kempe":"Margery_Kempe","Janabai":"en:Janabai","Enheduana":"Enheduanna","Gargi Vachaknavi":"Gargi_Vachaknavi","Maitreyi":"Maitreyí","Teano":"Téano","Aspasia de Mileto":"Aspasia_de_Mileto","Diotima de Mantinea":"Diotima","Lastenia de Mantinea":"Lastenia_de_Mantinea","Leontion":"Leontion","Ban Zhao":"Ban_Zhao","Macrina la Joven":"Macrina_la_Joven","Sosípatra":"Sosípatra","Hipatia de Alejandría":"Hipatia","Rabia al-Adawiyya":"Rabia_al_Adawiyya","Eloísa":"Eloísa","Hildegarda de Bingen":"Hildegarda_de_Bingen","Akka Mahadevi":"Akka_Mahadevi","Hadewijch de Amberes":"Hadewijch_de_Amberes","Matilde de Magdeburgo":"Matilde_de_Magdeburgo","Margarita Porete":"Margarita_Porete","Juliana de Norwich":"Juliana_de_Norwich","Catalina de Siena":"Catalina_de_Siena","Christine de Pizan":"Christine_de_Pizan","Isotta Nogarola":"Isotta_Nogarola","Teresa de Cartagena":"Teresa_de_Cartagena","Laura Cereta":"Laura_Cereta","Mirabai":"Mirabai","Teresa de Ávila":"Teresa_de_Jesús","Oliva Sabuco":"Oliva_Sabuco","Marie de Gournay":"Marie_de_Gournay","Anna Maria van Schurman":"Anna_Maria_van_Schurman","Margaret Cavendish":"Margaret_Cavendish","Anne Conway":"en:Anne Conway (philosopher)","Sor Juana Inés de la Cruz":"Juana_Inés_de_la_Cruz","Mary Astell":"Mary_Astell","Catharine Trotter Cockburn":"Catharine_Trotter","Émilie du Châtelet":"Émilie_du_Châtelet","Laura Bassi":"Laura_Bassi","Olympe de Gouges":"Olympe_de_Gouges","Josefa Amar y Borbón":"Josefa_Amar_y_Borbón","Mary Wollstonecraft":"Mary_Wollstonecraft","Sophie de Grouchy":"Sophie_de_Condorcet","Germaine de Staël":"Anne-Louise_Germaine_Necker","Mary Shepherd":"Mary_Shepherd","Sojourner Truth":"Sojourner_Truth","Harriet Martineau":"Harriet_Martineau","Flora Tristán":"Flora_Tristan","Harriet Taylor Mill":"Harriet_Taylor_Mill","Ada Lovelace":"Ada_Lovelace","Concepción Arenal":"Concepción_Arenal","Savitribai Phule":"Savitribai_Phule","Victoria Welby":"Victoria_Welby","Christine Ladd-Franklin":"Christine_Ladd-Franklin","Tarabai Shinde":"Tarabai_Shinde","Pandita Ramabai":"Pandita_Ramabai","Anna Julia Cooper":"Anna_J._Cooper","Jane Addams":"Jane_Addams","Charlotte Perkins Gilman":"Charlotte_Perkins_Gilman","Lou Andreas-Salomé":"Lou_Andreas-Salomé","Mary Whiton Calkins":"Mary_Whiton_Calkins","Emma Goldman":"Emma_Goldman","Rosa Luxemburgo":"Rosa_Luxemburgo","Alexandra Kollontai":"Aleksandra_Kolontái","Begum Rokeya":"Begum_Rokeya","He-Yin Zhen":"He_Zhen_(anarquista)","Susan Stebbing":"Susan_Stebbing","Hedwig Conrad-Martius":"Hedwig_Conrad-Martius","Edith Stein":"Edith_Stein","Dorothy Wrinch":"Dorothy_Maud_Wrinch","Susanne Langer":"Susanne_Langer","Grete Hermann":"Grete_Hermann","María Zambrano":"María_Zambrano","Rózsa Péter":"Rózsa_Péter","Hannah Arendt":"Hannah_Arendt","Simone de Beauvoir":"Simone_de_Beauvoir","Simone Weil":"Simone_Weil","Jeanne Hersch":"Jeanne_Hersch","Marjorie Grene":"Marjorie_Grene","Margaret Masterman":"en:Margaret_Masterman","Raya Dunayevskaya":"Raya_Dunayevskaya","Elizabeth Anscombe":"Elizabeth_Anscombe","Iris Murdoch":"Iris_Murdoch","Mary Midgley":"Mary_Midgley","Philippa Foot":"Philippa_Foot","Ruth Barcan Marcus":"Ruth_Barcan_Marcus","Mary Warnock":"Mary_Warnock","Mary Hesse":"Mary_Hesse","Rosario Castellanos":"Rosario_Castellanos","Graciela Hierro":"Graciela_Hierro","Mary Daly":"Mary_Daly","Sylvia Wynter":"en:Sylvia_Wynter","Agnes Heller":"Ágnes_Heller","Annette Baier":"en:Annette_Baier","Judith Jarvis Thomson":"Judith_Jarvis_Thomson","Nel Noddings":"Nel_Noddings","Luce Irigaray":"Luce_Irigaray","Nawal El Saadawi":"Nawal_El_Saadawi","Carla Lonzi":"Carla_Lonzi","Ruth Millikan":"Ruth_Millikan","Audre Lorde":"Audre_Lorde","Sarah Kofman":"Sarah_Kofman","Monique Wittig":"Monique_Wittig","Sophie Oluwole":"Sophie_Oluwole","Lélia Gonzalez":"Lélia_Gonzalez","Sandra Harding":"Sandra_Harding","Sara Ruddick":"Sara_Ruddick","Margaret Boden":"Margaret_Boden","Carol Gilligan":"Carol_Gilligan","Carolyn Merchant":"Carolyn_Merchant","Evelyn Fox Keller":"Evelyn_Fox_Keller","Julieta Kirkwood":"Julieta_Kirkwood","Cora Diamond":"Cora_Diamond","Hélène Cixous":"Hélène_Cixous","Lorraine Code":"en:Lorraine_Code","Val Plumwood":"Val_Plumwood","Luisa Muraro":"Luisa_Muraro","Carole Pateman":"Carole_Pateman","Fatema Mernissi":"Fatima_Mernissi","Onora O'Neill":"Onora_O'Neill","Julia Kristeva":"Julia_Kristeva","Victoria Camps":"Victoria_Camps","Genevieve Lloyd":"Genevieve_Lloyd","Marilyn Frye":"Marilyn_Frye","Gayatri Spivak":"Gayatri_Spivak","Silvia Federici":"Silvia_Federici","Gloria Anzaldúa":"Gloria_Anzaldúa","Alison Jaggar":"en:Alison_Jaggar","Patricia Churchland":"Patricia_Churchland","Chantal Mouffe":"Chantal_Mouffe","Angela Davis":"Angela_Davis","Donna Haraway":"Donna_Haraway","María Lugones":"María_Lugones","Celia Amorós":"Celia_Amorós","Helen Longino":"Helen_Longino","Susan Haack":"Susan_Haack","Shulamith Firestone":"Shulamith_Firestone","Catharine MacKinnon":"Catharine_MacKinnon","Susan Moller Okin":"Susan_Moller_Okin","Eva Feder Kittay":"en:Eva_Kittay","Martha Nussbaum":"Martha_Nussbaum","Nancy Fraser":"Nancy_Fraser","Adela Cortina":"Adela_Cortina","Adriana Cavarero":"Adriana_Cavarero","Barbara Cassin":"Barbara_Cassin","Gillian Rose":"en:Gillian_Rose","Patricia Hill Collins":"Patricia_Hill_Collins","Michèle Le Dœuff":"Michèle_Le_Dœuff","Isabelle Stengers":"Isabelle_Stengers","Iris Marion Young":"Iris_Marion_Young","Silvia Rivera Cusicanqui":"Silvia_Rivera_Cusicanqui","Seyla Benhabib":"Seyla_Benhabib","Amelia Valcárcel":"Amelia_Valcárcel","Sueli Carneiro":"Sueli_Carneiro","Rita Segato":"Rita_Segato","bell hooks":"Bell_hooks","Christine Korsgaard":"Christine_Korsgaard","Joan Tronto":"Joan_Tronto","Vandana Shiva":"Vandana_Shiva","Susan Wolf":"Susan_R._Wolf","Elizabeth Grosz":"Elizabeth_Grosz","Diana Maffía":"Diana_Maffía","Rosi Braidotti":"Rosi_Braidotti","Linda Martín Alcoff":"Linda_Martín_Alcoff","Sally Haslanger":"Sally_Haslanger","Wendy Brown":"Wendy_Brown","Karen Barad":"Karen_Barad","Francesca Gargallo":"Francesca_Gargallo","Uma Narayan":"Uma_Narayan","Kimberlé Crenshaw":"Kimberlé_Crenshaw","Elizabeth Anderson":"en:Elizabeth_S._Anderson","Catherine Malabou":"Catherine_Malabou","Rae Langton":"en:Rae_Langton","Saba Mahmood":"Saba_Mahmood","Ochy Curiel":"Ochy_Curiel","Miranda Fricker":"Miranda_Fricker","Rahel Jaeggi":"en:Rahel_Jaeggi","Sara Ahmed":"Sara_Ahmed","Marina Garcés":"Marina_Garcés","Remedios Zafra":"Remedios_Zafra","Lorena Cabnal":"Lorena_Cabnal","Elsa Dorlin":"Elsa_Dorlin","Djamila Ribeiro":"Djamila_Ribeiro","Kate Manne":"en:Kate_Manne","Amia Srinivasan":"en:Amia_Srinivasan","Axiotea de Fliunte":"Axiotea_de_Fliunte","Asclepigenia":"Asclepigenia","Ptolemaida de Cirene":"Ptolemaida_de_Cirene","Perpetua":"en:Perpetua","Walatta Petros":"en:Walatta_Petros","Kimpa Vita":"Kimpa_Vita","Nana Asma'u":"Nana_Asma’u","Olive Schreiner":"Olive_Schreiner","Adelaide Casely-Hayford":"Adelaide_Casely-Hayford","Charlotte Maxeke":"Charlotte_Maxeke","Huda Shaarawi":"Huda_Sha'arawi","Malak Hifni Nasif":"Malak_Hifni_Nasif","Funmilayo Ransome-Kuti":"Funmilayo_Ransome-Kuti","Leila Ahmed":"Leila_Ahmed","Wangari Maathai":"Wangari_Maathai","Molara Ogundipe-Leslie":"Molara_Ogundipe","Ifi Amadiume":"Ifi_Amadiume","Mamphela Ramphele":"en:Mamphela_Ramphele","Awa Thiam":"Awa_Thiam","Catherine Acholonu":"Catherine_Obianuju_Acholonu","Amina Mama":"Amina_Mama","Sylvia Tamale":"Sylvia_Tamale","Úrsula de Jesús":"Úrsula_de_Jesús","Madre Castillo":"Francisca_Josefa_del_Castillo","Nísia Floresta":"Nísia_Floresta","Juana Manso":"Juana_Manso","Paulina Luisi":"Paulina_Luisi","Dolores Cacuango":"Dolores_Cacuango","Alicia Moreau de Justo":"Alicia_Moreau_de_Justo","Victoria Ocampo":"Victoria_Ocampo","Heleieth Saffioti":"Heleieth_Saffioti","Domitila Barrios de Chungara":"Domitila_Barrios_de_Chungara","Josefina Ludmer":"Josefina_Ludmer","Beatriz Nascimento":"Beatriz_Nascimento","Ofelia Schutte":"Ofelia_Schutte","Marcela Lagarde":"Marcela_Lagarde","Suely Rolnik":"Suely_Rolnik","Nelly Richard":"Nelly_Richard","Rigoberta Menchú":"Rigoberta_Menchú","Maristella Svampa":"Maristella_Svampa","Raquel Gutiérrez Aguilar":"Raquel_Gutiérrez","Lohana Berkins":"Lohana_Berkins","Verónica Gago":"Verónica_Gago","Yásnaya Elena Aguilar":"Yásnaya_Aguilar","Lopamudra":"Lopa_Mudra","Mahapajapati Gotami":"Mahapajapati_Gotami","Kisa Gotami":"en:Kṛśā_Gautamī","Avvaiyar":"en:Avvaiyar_(Sangam_poet)","Julia Domna":"Julia_Domna","Xie Daoyun":"Xie_Daoyun","Andal":"Andal","Yeshe Tsogyal":"Yeshe_Tsogyal","Machig Labdrön":"en:Machig_Labdrön","Muktabai":"en:Muktabai","Im Yunjidang":"Im_Yunjidang","Tadano Makuzu":"en:Tadano_Makuzu","Wang Zhenyi":"Wang_Zhenyi","Kang Jeongildang":"en:Kang_Jeongildang","Táhirih":"Táhirih","Zaynab Fawwaz":"en:Zaynab_Fawwaz","Qiu Jin":"Qiu_Jin","Yosano Akiko":"Akiko_Yosano","Kartini":"Kartini","Yamakawa Kikue":"Yamakawa_Kikue","Na Hye-sok":"Na_Hye-sok","Uma Chakravarti":"Uma_Chakravarti","Kamla Bhasin":"en:Kamla_Bhasin","Chizuko Ueno":"Ueno_Chizuko","Asma Barlas":"Asma_Barlas","Li Xiaojiang":"en:Li_Xiaojiang","Germaine Greer":"Germaine_Greer","Raewyn Connell":"Raewyn_Connell","Haunani-Kay Trask":"en:Haunani-Kay_Trask","Ngahuia Te Awekotuku":"Ngahuia_Te_Awekotuku","Linda Tuhiwai Smith":"Linda_Tuhiwai_Smith","Marilyn Waring":"Marilyn_Waring","Moira Gatens":"en:Moira_Gatens","Aileen Moreton-Robinson":"en:Aileen_Moreton-Robinson","Teresia Teaiwa":"en:Teresia_Teaiwa","Margaret Fuller":"Margaret_Fuller","Elizabeth Cady Stanton":"Elizabeth_Cady_Stanton","Ellen Key":"Ellen_Key","Mary Parker Follett":"Mary_Parker","Maria Montessori":"Maria_Montessori","Grace de Laguna":"en:Grace_de_Laguna","Rachel Carson":"Rachel_Carson","Yuriko Saito":"Yuriko_Saito","Sei Shōnagon":"Sei_Shōnagon","Murasaki Shikibu":"Murasaki_Shikibu","Vernon Lee":"Vernon_Lee","Anni Albers":"Anni_Albers","Mary Mothersill":"en:Mary_Mothersill","Susan Sontag":"Susan_Sontag","Ellen Dissanayake":"en:Ellen_Dissanayake","Elaine Scarry":"en:Elaine_Scarry","Sianne Ngai":"en:Sianne_Ngai","Emily Brady":"en:Emily_Brady","Katya Mandoki":"Katya_Mandoki","Linda Nochlin":"Linda_Nochlin","Lucy Lippard":"Lucy_R._Lippard","Rosalind Krauss":"Rosalind_E._Krauss","Laura Mulvey":"Laura_Mulvey","Mieke Bal":"Mieke_Bal","Griselda Pollock":"Griselda_Pollock","Estrella de Diego":"Estrella_de_Diego","Amelia Jones":"Amelia_Jones","Koyo Kouoh":"Koyo_Kouoh","Lygia Clark":"Lygia_Clark","Marilyn Strathern":"Marilyn_Strathern","Lynn Margulis":"Lynn_Margulis","María Mallo":"María_Mallo","Temistoclea":"Temistoclea","Arete de Cirene":"Areta_de_Cirene","Hiparquia de Maronea":"Hiparquía","Lal Ded":"Lal_Ded","Damaris Masham":"Damaris_Cudworth_Masham","Hiratsuka Raichō":"Raichō_Hiratsuka","Kate Millett":"Kate_Millett","Chandra T. Mohanty":"Chandra_Talpade_Mohanty","Yuderkys Espinosa":"Yuderkys_Espinosa_Miñoso","Cleobulina de Rodas":"Cleobulina","Mía de Crotona":"Myia","Esara de Lucania":"Aesara","Fintis":"Fintis","Edesia de Alejandría":"Edesia","Fátima al-Fihri":"Fátima_al-Fihri","Teresa de la Parra":"Teresa_de_la_Parra","Marilena Chaui":"Marilena_de_Souza_Chaui","Julieta Paredes":"Julieta_Paredes","Bibi Khanum Astarabadi":"en:Bibi_Khanoom_Astarabadi","Mai Ziadeh":"May_Ziade","Nazira Zeineddine":"en:Nazira_Zain_al-Din","Carolyn Korsmeyer":"Carolyn_Korsmeyer","Bonnie Mann":"en:Bonnie_Mann","Isabel de Bohemia":"Isabel de Bohemia y del Palatinado","Nancy Cartwright":"Nancy_Cartwright_(filósofa)","Judith Butler":"Judith Butler","George Eliot":"George_Eliot","Ayn Rand":"Ayn_Rand","Isabelle de Charrière":"Isabelle_de_Charrière","Cristina de Suecia":"Cristina_de_Suecia","Annie Besant":"Annie_Besant","María Gaetana Agnesi":"María_Gaetana_Agnesi","Helena Blavatsky":"Helena_Blavatsky","Clara de Asís":"Clara_de_Asís","Sophie Germain":"Sophie_Germain","Brígida de Suecia":"Brígida_de_Suecia","Ingeborg Bachmann":"Ingeborg_Bachmann","Madeleine de Scudéry":"Madeleine_de_Scudéry","Elena Cornaro Piscopia":"Elena_Cornaro_Piscopia","Ricarda Huch":"Ricarda_Huch","Voltairine de Cleyre":"Voltairine_de_Cleyre","María la Judía":"María_la_Judía","Anandamayi Ma":"Anandamayi_Ma","Doria Shafik":"Doria_Shafik","Etel Adnan":"Etel_Adnan","Élisabeth Badinter":"Élisabeth_Badinter","Antoinette Brown Blackwell":"Antoinette_Blackwell","Clémence Royer":"Clémence_Royer","Frances Power Cobbe":"Frances_Power_Cobbe","Moderata Fonte":"Moderata_Fonte","Lucrezia Marinella":"Lucrezia_Marinella","Mary Everest Boole":"Mary_Everest_Boole","Shoshana Zuboff":"Shoshana_Zuboff","Oodgeroo Noonuccal":"Oodgeroo_Noonuccal","Karoline von Günderrode":"Karoline_von_Günderrode","Tanella Boni":"Tanella_Boni","Frances Wright":"Frances_Wright","Tullia d'Aragona":"Tullia_d'Aragona","Helene Stöcker":"Helene_Stöcker","María Skobtsova":"Maria_Skobtsova","Lea Ypi":"Lea_Ypi","Anna Tumarkin":"Anna_Tumarkin","Rosemary Radford Ruether":"Rosemary_Radford_Ruether","Julia Annas":"Julia_Annas","Grace Lee Boggs":"Grace_Lee_Boggs","Catharine Macaulay":"Catharine_Macaulay","Helene von Druskowitz":"Helene_von_Druskowitz","Rebecca Goldstein":"Rebecca_Goldstein","Khema":"Khemā","Ksenija Atanasijević":"Ksenija_Atanasijević","Gadis Arivia":"Gadis_Arivia","Ti-Grace Atkinson":"Ti-Grace_Atkinson","Jeanne Guyon":"Jeanne_Marie_Bouvier_de_la_Motte_Guyon","Madame de Lambert":"Anne-Thérèse_de_Marguenat_de_Courcelles","Brigitte Vasallo":"Brigitte_Vasallo","Sofia Yanóvskaya":"Sofía_Yanóvskaya"};
/* temas → dirección en el mapa: [x: abstracta(-) / política(+), y: lógica(-) / mística(+)] */
const TAGS={
 logica:["lógica",-1,-1], ciencia:["ciencia",-.65,-.8], mente:["mente",-.8,-.35], lenguaje:["lenguaje",-.55,-.45],
 metafisica:["metafísica",-.7,.35], conocimiento:["conocimiento",-.45,-.6], etica:["ética",.05,0], estetica:["estética",-.15,.75],
 existencia:["existencia",.05,.6], mistica:["mística",-.3,1], cuerpo:["cuerpo",.5,.55], educacion:["educación",.35,-.35],
 feminismo:["feminismo",.65,.05], politica:["política",.9,-.35], ecologia:["ecología",.55,.35], decolonial:["decolonial",.95,.3],
 raza:["raza",.85,-.05], economia:["economía",.7,-.7], cuidado:["cuidado",.35,.2], psique:["psique",-.1,.45]
};
/* épocas: color */
const ERAS=[
 {n:"Antigüedad",to:500,h:32},{n:"Medieval",to:1450,h:352},{n:"Renacimiento y Barroco",to:1700,h:300},
 {n:"Ilustración",to:1800,h:255},{n:"Siglo XIX",to:1880,h:215},{n:"Siglo XX",to:1940,h:178},{n:"Contemporánea",to:9999,h:130}
];
const SIMBOLOS=['▲','■','◆','●','▼','★','✱'];
const OSCURO=["#e9c16e", "#ef6e27", "#e58baa", "#3a9ce2", "#84d7fe", "#a5f9cc", "#efe97f"]; /* colores para las imágenes generadas (fondo oscuro) */
ERAS.forEach((e,k)=>{e.k=k;e.h='var(--e'+k+')';e.sym=SIMBOLOS[k];e.hex=OSCURO[k]});
const eraOf=b=>ERAS.find(e=>b<e.to);
/* continentes: se deducen del primer lugar (origen o lugar principal de su obra) */
const CONTS=["América del Norte","América Latina y el Caribe","Europa","África","Asia","Oceanía"];
const CONT_RX=[
 [1,/Lima|Colombia|Uruguay|Ecuador|Bolivia|Cuba|Caracas|Oaxaca|México|Nueva España|Buenos Aires|Argentina|La Paz|Chile|Guatemala|Brasil|São Paulo|Santos|República Dominicana|Jamaica|Panamá/],
 [3,/Costa de Marfil|Camerún|Cartago|Etiopía|Congo|Sokoto|Sudáfrica|Sierra Leona|Kenia|Senegal|Uganda|Alejandría|Cirene|Fez|Egipto|Nigeria|Orán|Túnez|Marruecos|Cairuán/],
 [4,/Beirut|Indonesia|Kioto|Tíbet|Corea|Japón|Irán|Persia|Líbano|Nazaret|Java|Siria|India|Mesopotamia|China|Tokio|Cachemira|Bengala|Basora|Pérgamo|Capadocia|Mileto|Pakistán|Baréin|Calcuta|Bombay|Dehradun|Karnataka|Rajastán|Maharashtra|Éfeso|Asia Menor|Anatolia/],
 [5,/Aotearoa|Hawái|Fiyi|Australia|Nueva Zelanda|Sídney/],
 [0,/Estados Unidos|EE\. UU\.|Nueva York|Connecticut|Chicago|Canadá|Minnesota|Texas|Pensilvania|Ottawa|Ohio|Nueva Jersey|Milwaukee|Massachusetts|Kentucky|Filadelfia|Denver|Cleveland|Carolina|Boston|Baltimore|California|Alabama/]];
const CONT_FIX={"Dorothy Wrinch":2,"Francesca Gargallo":1,"Nelly Richard":1,"Griselda Pollock":2};
function contOf(n,pl){ if(n in CONT_FIX)return CONT_FIX[n]; const f=pl.split(" / ")[0];
  for(const [c,rx] of CONT_RX) if(rx.test(f)) return c; return 2; }

function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)/4294967295}
const yr=(y,a)=>(a?"c. ":"")+(y<0?(-y)+" a.C.":y);
const datesOf=p=>p.ob?('obra clave: '+p.ob):p.d===null?('n. '+yr(p.b,p.a)):p.d==="?"?(yr(p.b,p.a)+(p.b<1000?' (activa)':'')):(yr(p.b,p.a)+' – '+yr(p.d,p.a));

const P=D.map((r,i)=>{
  let [n,b,d,a,pl,tr,tg,s,w]=r, tags=tg.split(" "), ob=null;
  if(a===2){ob=b;b=b-45;}  /* se coloca como si hubiera nacido ~45 años antes de su obra clave */
  let x=0,y=0,wt=0;
  tags.forEach((t,k)=>{const f=k===0?2:1;x+=TAGS[t][1]*f;y+=TAGS[t][2]*f;wt+=f});
  x/=wt;y/=wt;
  x+= (hash(n)-.5)*.35; y+=(hash(n+"y")-.5)*.35;
  const e=eraOf(b);
  return {i,n,b,d,a,ob,pl,tr,tags,s,w,ix:x,iy:y,era:e,h:e.h,c:contOf(n,pl)};
});
/* orden cronológico para la línea del tiempo */
[...P].sort((p,q)=>p.b-q.b||p.n.localeCompare(q.n)).forEach((p,k)=>p.rank=k);
CONTS.forEach((_,c)=>P.filter(p=>p.c===c).sort((a,b)=>a.rank-b.rank).forEach((p,k,arr)=>{p.crank=(k+.5)/arr.length}));

const map=document.getElementById('map'), frame=document.getElementById('frame'), escala=document.getElementById('escala');
/* zoom: escalamos el mapa ya colocado (no se recalcula nada) */
let ZM=1, MW=0, MH=0;
function aplicarZoom(z, cx, cy){
  const z0=ZM; ZM=Math.max(.2,Math.min(2.5,z));
  /* mantener el punto que se mira (cx,cy en coordenadas del marco) */
  const fx=cx??frame.clientWidth/2, fy=cy??frame.clientHeight/2;
  const mx=(frame.scrollLeft+fx)/z0, my=(frame.scrollTop+fy)/z0;
  escala.style.width=MW*ZM+'px'; escala.style.height=MH*ZM+'px';
  map.style.transform=ZM===1?'':`scale(${ZM})`;
  frame.scrollLeft=mx*ZM-fx; frame.scrollTop=my*ZM-fy;
  document.getElementById('znivel').textContent=Math.round(ZM*100)+' %';
}
let mode='ideas', sel=null, activeTag=null, query='';

P.forEach(p=>{
  const el=document.createElement('button');
  el.className='n'; el.textContent=p.n; el.style.setProperty('--ec',p.h); el.dataset.sym=p.era.sym;
  el.setAttribute('aria-label',p.n+', '+p.era.n);
  el.style.setProperty('--nf',p.w===3?20:p.w===2?16.5:14);
  if(p.w===3) el.style.fontWeight=700;
  el.onclick=e=>{e.stopPropagation();select(p)};
  p.el=el; map.appendChild(el);
});

function dims(){
  const dd=document.documentElement.dataset;
  const Z=(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom'))||1)*(dd.letra==='od'?1.2:1)*(dd.esp==='amplio'?1.12:1); /* letra más grande o más ancha → mapa más grande */
  const W=Math.max(frame.clientWidth||innerWidth-32, (mode==='time'?2700:mode==='world'?2050:1720)*Z);
  if(mode!=='world'){
    const H=mode==='time'?Math.max(1050*Z,innerHeight*.95):Math.max(2150*Z,Math.min(2450*Z,W*1.32));
    return {W,H};
  }
  /* cada continente ocupa un ancho proporcional a lo que ocupan sus nombres */
  const area=CONTS.map((_,c)=>P.filter(p=>p.c===c).reduce((t,p)=>t+p.el.offsetWidth*(p.el.offsetHeight+6),0));
  const minW=CONTS.map((_,c)=>Math.max(130,...P.filter(p=>p.c===c).map(p=>p.el.offsetWidth+16)));
  const tot=area.reduce((a,b)=>a+b,0);
  /* primero el mínimo para que quepa el nombre más largo; el resto, según su área */
  const rest=Math.max(0,W-16-minW.reduce((a,b)=>a+b,0));
  const cw=minW.map((m,c)=>m+area[c]/tot*rest); cols=[];let x=8;
  cw.forEach(w=>{cols.push([x,x+w]);x+=w});
  const H=Math.max(900,...area.map((a,c)=>a*1.9/(cols[c][1]-cols[c][0])+140));
  return {W,H};
}
let cols=[];

function layout(){
  const {W,H}=dims();
  map.style.width=W+'px'; map.style.height=H+'px'; MW=W; MH=H; escala.style.width=W*ZM+'px'; escala.style.height=H*ZM+'px';
  map.querySelectorAll('.axis,.tick').forEach(e=>e.remove());
  const pad=40, N=P.length;
  const spread=(key)=>{const v=P.map(p=>p[key]),lo=Math.min(...v),hi=Math.max(...v);
    const o=[...P].sort((a,b)=>a[key]-b[key]);o.forEach((p,k)=>p[key+'n']=.45*(p[key]-lo)/(hi-lo)+.55*(k+.5)/N)};
  spread('ix');spread('iy');
  P.forEach(p=>{
    p.w0=p.el.offsetWidth; p.h0=p.el.offsetHeight;
    let nx,ny;
    if(mode==='ideas'){ nx=p.ixn; ny=1-p.iyn; }
    else if(mode==='time'){ nx=(p.rank+.5)/N; ny=1-p.iyn; }
    p.lo=4; p.hi=W-4;
    if(mode==='world'){
      const [a,b]=cols[p.c]; p.lo=a+6; p.hi=b-6;
      const cx=p.lo+p.w0/2+p.ixn*(p.hi-p.lo-p.w0);
      p.x=cx-p.w0/2; p.y=80+p.crank*(H-120)-p.h0/2;
    } else { p.x=pad+nx*(W-2*pad)-p.w0/2; p.y=pad+ny*(H-2*pad)-p.h0/2; }
    p.tx=p.x; p.ty=p.y;
  });
  relax(W,H);
  P.forEach(p=>{p.el.style.left=p.x+'px';p.el.style.top=p.y+'px'});
  if(mode==='ideas'){
    axis('↑ mística · poética · existencial',W/2,8,'c');
    axis('↓ lógica · científica',W/2,H-22,'c');
    axis('← abstracta',8,H/2,'l');
    axis('política · encarnada →',W-8,H/2,'r');
  } else if(mode==='world'){
    CONTS.forEach((c,k)=>{
      const t=document.createElement('div'); t.className='tick'; t.style.left=cols[k][0]+'px';
      if(k===0)t.style.borderLeft='0';
      t.innerHTML='<b style="top:8px;white-space:normal;max-width:'+(cols[k][1]-cols[k][0]-10)+'px">'+c+' · '+P.filter(p=>p.c===k).length+'</b>'; map.appendChild(t);
    });
    axis('↓ de las más antiguas a las más recientes',W-8,H-22,'r');
  } else {
    axis('↑ mística · poética',8,8,'l'); axis('↓ lógica · científica',8,H-22,'l');
    ERAS.forEach((e,k)=>{
      const first=P.filter(p=>p.era===e).sort((a,b)=>a.rank-b.rank)[0]; if(!first)return;
      const t=document.createElement('div'); t.className='tick';
      t.style.left=(pad+(first.rank/N)*(W-2*pad))+'px';
      t.innerHTML='<b style="top:'+(26+(k%2)*16)+'px">'+e.n+'</b>'; map.appendChild(t);
    });
  }
}
function axis(t,x,y,al){
  const a=document.createElement('div');a.className='axis';a.textContent=t;
  a.style.top=y+'px';
  if(al==='c'){a.style.left=x+'px';a.style.transform='translateX(-50%)'}
  else if(al==='l')a.style.left=x+'px'; else a.style.right=(parseFloat(map.style.width)-x)+'px';
  map.appendChild(a);
}
/* separa rectángulos que se solapan, tirando suavemente hacia su sitio */
function relax(W,H){
  /* barrido por x: solo se comparan nombres que se tocan en horizontal (rápido incluso en móvil) */
  const g=3, S=P.slice(), ymin=mode==='time'?64:mode==='world'?40:26;
  let best=1e9,bestIt=0;
  for(let it=0;it<1500;it++){
    let moved=false,n=0;
    for(let i=1;i<S.length;i++){const t=S[i];let j=i-1;while(j>=0&&S[j].x>t.x){S[j+1]=S[j];j--}S[j+1]=t}
    for(let i=0;i<S.length;i++){const a=S[i];
      for(let j=i+1;j<S.length;j++){const b=S[j];
        if(b.x>=a.x+a.w0+g)break;
        const ox=Math.min(a.x+a.w0,b.x+b.w0)-Math.max(a.x,b.x)+g;
        const oy=Math.min(a.y+a.h0,b.y+b.h0)-Math.max(a.y,b.y)+g;
        if(ox>0&&oy>0){moved=true;n++;
          if(oy<ox||mode==='time'){const s=(a.y+a.h0/2<b.y+b.h0/2?-1:1)*oy/2;a.y+=s;b.y-=s}
          else{const s=(a.x+a.w0/2<b.x+b.w0/2?-1:1)*ox/2;a.x+=s;b.x-=s}
        }
      }
    }
    for(const p of P){
      if(it<200){p.x+=(p.tx-p.x)*.02; p.y+=(p.ty-p.y)*.02;}
      p.x=Math.max(p.lo,Math.min(p.hi-p.w0,p.x)); p.y=Math.max(ymin,Math.min(H-p.h0-26,p.y));
    }
    if(!moved)break;
    /* si en 120 vueltas ya no mejora, paramos: lo que queda son roces mínimos */
    if(n<best){best=n;bestIt=it}else if(it>500&&it-bestIt>300)break;
  }
}

/* «vecinas»: comparten temas (sobre todo el principal), continente, cercanía en el mapa y, a igualdad, en el tiempo */
function neighbours(p,k=7){
  return P.filter(q=>q!==p).map(q=>{
    const sh=q.tags.filter(t=>p.tags.includes(t)).length;
    const jac=sh/(new Set([...p.tags,...q.tags]).size);
    const main=(q.tags[0]===p.tags[0]?.35:0)+(q.tags.includes(p.tags[0])?.15:0);
    const d=-(jac*1.4+main+(q.c===p.c?.2:0))+Math.hypot(q.ix-p.ix,q.iy-p.iy)*.5+Math.abs(q.b-p.b)/5000;
    return {q,d};
  }).sort((a,b)=>a.d-b.d).slice(0,k).map(o=>o.q);
}
const card=document.getElementById('card');
/* su artículo de Wikipedia (en español si existe); si no lo tenemos, la búsqueda en Wikipedia */
const WIKI_EXTRA={"Gerda Walther":"de:Gerda Walther","Karaikkal Ammaiyar":"Karaikkal Ammaiyar","Janet Wolff":"en:Janet Wolff","Sulabha":"en:Sulabha"};
function wikiURL(p){
  const t=WIKI[p.n]||WIKI_EXTRA[p.n];
  if(!t)return 'https://es.wikipedia.org/w/index.php?search='+encodeURIComponent(p.n);
  const m=t.match(/^(en|de|fr):(.*)$/), l=m?m[1]:'es', x=m?m[2]:t;
  return `https://${l}.wikipedia.org/wiki/`+encodeURIComponent(x.replace(/ /g,'_'));
}
const nombre=p=>`<a class="nom" href="${wikiURL(p)}" target="_blank" rel="noopener">${p.n}<span class="vh"> (abre su página de Wikipedia en otra pestaña)</span><span class="ext" aria-hidden="true">↗</span></a>`;
/* retrato (imagen libre de Wikimedia Commons) o, si no hay, la lechuza en el color de su época */
function cara(p){
  const c=(window.CARAS||{})[p.n];
  if(!c)return `<figure class="cara"><span title="No hay un retrato libre de ${p.n}"><i class="buho" aria-hidden="true"></i></span><figcaption>Sin retrato libre</figcaption></figure>`;
  const alt=(c[1]?'Representación imaginada de ':'Retrato de ')+p.n;
  return `<figure class="cara"><a href="creditos.html#${c[0]}" title="${alt}. Autoría y licencia de la imagen"><img src="caras/${c[0]}.webp" alt="${alt}" width="192" height="240" decoding="async"></a>${c[1]?'<figcaption>Retrato imaginado</figcaption>':''}</figure>`;
}
function select(p){
  sel=p;
  P.forEach(q=>q.el.classList.remove('sel','near'));
  if(!p){card.classList.remove('open');if(!quizOpen)setHash('');return}
  p.el.classList.add('sel');
  const nb=neighbours(p); nb.forEach(q=>q.el.classList.add('near'));
  const dates=datesOf(p);
  const wq=encodeURIComponent(p.n);
  card.style.setProperty('--ec',p.h);
  const atr=t=>String(t).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const prev=hist.length?hist[hist.length-1]:null;
  const sameCtx=prev&&prev.q===query&&prev.era===activeEra&&prev.cont===activeCont;
  const prevTxt=!prev?'':(sameCtx&&prev.p!=null)?P[prev.p].n:prev.q?'«'+prev.q+'»':prev.era!=null?ERAS[prev.era].n:prev.cont!=null?CONTS[prev.cont]:prev.p!=null?P[prev.p].n:'el inicio';
  card.innerHTML=`<button class="x" aria-label="Cerrar">×</button>
   ${prev?`<button class="back" type="button">← Volver a ${atr(prevTxt)}</button>`:''}
   <div class="cab">${cara(p)}<div><h2>${nombre(p)}</h2>
   <div class="meta">${dates} · <button class="lk" data-q="${atr(p.pl.split(' / ')[0])}">${p.pl}</button><br><button class="lk" data-q="${atr(p.tr)}">${p.tr}</button> · <button class="lk" data-era="${p.era.k}">${p.era.n}</button> · <button class="lk" data-cont="${p.c}">${CONTS[p.c]}</button></div></div></div>
   <p>${enlazar(p.s,p)}</p>${homLine(p)}
   <h3>Temas <span class="hint">(toca uno para explorarlo)</span></h3><div class="tags">${p.tags.map(t=>`<button class="chip" data-t="${t}">${TAGS[t][0]} →</button>`).join('')}</div>
   <h3>Vecinas en el mapa</h3><div class="nb">${nb.map(q=>`<button data-i="${q.i}" style="--ec:${q.h}">${q.n}</button>`).join(' · ')}</div>
   <h3>Seguir leyendo</h3>
   <div class="links"><a target="_blank" rel="noopener" href="${wikiURL(p)}">Wikipedia${WIKI[p.n]&&WIKI[p.n].startsWith('en:')?' (en inglés)':''}</a>
   <a target="_blank" rel="noopener" href="https://plato.stanford.edu/search/searcher.py?query=${wq}">Stanford Encyclopedia</a>
   <a target="_blank" rel="noopener" href="https://www.google.com/search?tbm=bks&q=${wq}">Google Libros</a></div>
   ${tiendas(p)}
   <div class="share"><button class="main" id="shp">Compartir</button><button id="cpl">Copiar enlace</button></div>`;
  card.querySelector('#shp').onclick=()=>share({title:p.n+' · Eso dijo ella',text:p.n+': '+p.s,url:linkTo(p)});
  card.querySelector('#cpl').onclick=()=>copy(linkTo(p));
  setHash('#'+encodeURIComponent(p.n));
  card.querySelector('.x').onclick=()=>select(null);
  card.querySelectorAll('.nb button').forEach(b=>b.onclick=()=>{recordar();const q=P[+b.dataset.i];select(q);goTo(q)});
  card.querySelectorAll('.tags .chip').forEach(b=>b.onclick=()=>explorar(TAGS[b.dataset.t][0]));
  card.querySelectorAll('.lk').forEach(b=>b.onclick=()=>{if(b.dataset.era!=null)explorar('',{era:+b.dataset.era});else if(b.dataset.cont!=null)explorar('',{cont:+b.dataset.cont});else if(b.dataset.i!=null){recordar();const q=P[+b.dataset.i];select(q);goTo(q)}else explorar(b.dataset.q)});
  const bk=card.querySelector('.back'); if(bk)bk.onclick=volver;
  card.classList.add('open');
}
/* ---------- comprar sus libros: tres opciones claras y el resto plegado ---------- */
function tiendas(p){
  const T=window.TIENDAS||[]; if(!T.length)return '';
  const a=t=>{const af=window.esAfiliado&&window.esAfiliado(t[0]);
    return `<a target="_blank" rel="${af?'sponsored ':''}noopener" href="${window.enlaceTienda(t[0],t[3],p.n).replace(/"/g,'&quot;')}">${t[1]}</a>${t[2]?` <span class="hint">(${t[2]})</span>`:''}`};
  const main=T.filter(t=>t[4]), rest=T.filter(t=>!t[4]);
  return `<h3>Leer sus libros</h3><ul class="tiendas">${main.map(t=>`<li>${a(t)}</li>`).join('')}</ul>
   ${rest.length?`<details class="mas"><summary>Más tiendas</summary><ul class="tiendas">${rest.map(t=>`<li>${a(t)}</li>`).join('')}</ul></details>`:''}
   <p class="afil">Algunos enlaces pueden ser de afiliado: si compras, la web recibe una pequeña comisión sin coste para ti. <a href="acerca.html#libros">Más información</a>.</p>`;
}
/* ---------- navegación entre entradas: cada tema, corriente o lugar abre una búsqueda nueva ---------- */
let hist=[];
function recordar(){ const h={q:query,p:sel?sel.i:null,era:activeEra,cont:activeCont}, t=hist[hist.length-1];
  if(t&&t.q===h.q&&t.p===h.p&&t.era===h.era&&t.cont===h.cont)return; hist.push(h); if(hist.length>40)hist.shift(); }
function abrirEntrada(term,p,f){
  f=f||{}; query=term; qi.value=term; activeTag=null; activeCont=f.cont??null; activeEra=f.era??null;
  filter();
  /* sin búsqueda (época o continente): abrimos la más destacada de las visibles */
  const vis=P.filter(x=>!x.el.classList.contains('off')).sort((a,b)=>b.w-a.w||a.rank-b.rank);
  const first=p||(homNow&&homNow.list[0]&&homNow.list[0].p)||(hits[0]&&hits[0].p)||(!term&&vis[0]);
  if(first){select(first);goTo(first)} else select(null);
}
function explorar(term,f){ f=f||{}; if(term===query&&(f.era??null)===activeEra&&(f.cont??null)===activeCont)return; recordar(); clearTimeout(qt); abrirEntrada(term,null,f); }
function volver(){ const h=hist.pop(); if(!h)return; clearTimeout(qt); abrirEntrada(h.q||'',h.p!=null?P[h.p]:null,{era:h.era,cont:h.cont}); }
/* convierte en enlaces las ideas del diccionario, las otras filósofas y los filósofos que aparecen en un texto */
let ENL=null; /* se construye la primera vez (necesita los diccionarios de filósofos e ideas) */
const crearENL=(()=>{const m=[];
  P.forEach(q=>{const n=q.n;m.push({t:n,i:q.i});const ap=n.split(' ').filter(w=>w.length>4&&/^[A-ZÁÉÍÓÚÑ]/.test(w)).pop();if(ap&&ap!==n&&!['Alejandría','Mantinea','Bohemia','Ávila','Bingen','Norwich','Siena','Cirene','Crotona','Lucania','Esparta','Rodas','Fliunte','Maronea','Mileto','Nishapur','Amberes','Magdeburgo','Cartagena'].includes(ap))m.push({t:ap,i:q.i})});
  HOMK.forEach(h=>h.alias.forEach(a=>{if(a.length>=4)m.push({t:a,q:h.name})}));
  CONK.forEach(c=>c.roots.forEach(r=>{if(r.length>=4&&!r.includes(' '))m.push({root:r,q:null})}));
  return m});
function enlazar(txt,self){
  if(!ENL)ENL=crearENL();
  const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  let out='',i=0; const used=new Set();
  const re=/[A-Za-zÀ-ÿĀ-ž'-]+(?:\s(?:de|del|la|y|von|van|al-)?\s?[A-ZÁÉÍÓÚÑ][A-Za-zÀ-ÿĀ-ž'-]+)*/g; let m;
  while((m=re.exec(txt))){
    let w=m[0], hit=null;
    for(const e of ENL){ if(e.t&&e.i!=null&&w.startsWith(e.t)&&e.i!==self.i&&!used.has(e.t)){hit={html:`<button class="lk" data-i="${e.i}">${esc(e.t)}</button>`+esc(w.slice(e.t.length)),k:e.t};break}
      if(e.t&&e.q&&(w===e.t||w.startsWith(e.t+' '))&&!used.has(e.t)){hit={html:`<button class="lk" data-q="${esc(e.q)}">${esc(w)}</button>`,k:e.t};break} }
    if(!hit&&w.length>=4&&!/^[A-ZÁÉÍÓÚÑ]/.test(w)){const nw=norm(w);
      for(const e of ENL){ if(e.root&&(nw===e.root||(e.root.length>=5&&nw.startsWith(e.root)))&&!used.has(e.root)){hit={html:`<button class="lk" data-q="${esc(w)}">${esc(w)}</button>`,k:e.root};break} } }
    out+=esc(txt.slice(i,m.index))+(hit?hit.html:esc(w)); if(hit)used.add(hit.k); i=m.index+w.length;
  }
  return out+esc(txt.slice(i));
}
function goTo(p){
  const bh=movimientoReducido()?'auto':'smooth';
  if(mode==='lista'){if(p.li)p.li.scrollIntoView({block:'center',behavior:bh});return}
  frame.scrollTo({left:p.x*ZM-frame.clientWidth/2,behavior:bh});
  const r=frame.getBoundingClientRect();
  window.scrollTo({top:scrollY+r.top+p.y*ZM-(innerWidth<=640?innerHeight*.18:innerHeight/2),behavior:bh});
}

function norm(s){return s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase()}
function lev(a,b){const m=a.length,n=b.length;if(Math.abs(m-n)>2)return 9;let r=[...Array(n+1).keys()];
  for(let i=1;i<=m;i++){let pr=r[0];r[0]=i;for(let j=1;j<=n;j++){const t=r[j];r[j]=Math.min(r[j]+1,r[j-1]+1,pr+(a[i-1]===b[j-1]?0:1));pr=t}}return r[n]}
/* ¿el nombre se parece a lo buscado? tolera erratas (Braidoitti → Braidotti) */
function nameScore(p,q){
  const n=norm(p.n); if(n.includes(q))return n.startsWith(q)?3:2;
  const words=n.split(/[\s-]+/), qs=q.split(/\s+/).filter(Boolean);
  return qs.every(w=>words.some(x=>x.startsWith(w)||(w.length>=4&&lev(w,x.slice(0,w.length+1))<=(w.length>6?2:1))||(w.length>=4&&lev(w,x)<=(w.length>6?2:1))))?1:0;
}
/* ---------- homólogas: si buscas a un filósofo, te propone a una filósofa ---------- */
/* "Nombre|alias": [[filósofa, de qué habla ella sobre lo mismo, desde su situación], …] */
const HOM={
 "Pitágoras|Pitagoras":[["Teano","el número y la armonía, llevados a la vida diaria y a la casa"]],
 "Sócrates|Socrates":[["Diotima de Mantinea","el amor por el saber, explicado por una sacerdotisa: el deseo como camino hacia la verdad"]],
 "Platón|Platon":[["Diotima de Mantinea","la Belleza y el Bien, alcanzados a través del amor y el cuerpo, no contra ellos"]],
 "Aristóteles|Aristoteles":[["Philippa Foot","la virtud como el bien natural de un ser vivo, sin dejar a nadie fuera de la «naturaleza humana»"]],
 "Diógenes|Diogenes|Crates":[["Hiparquia de Maronea","vivir sin convenciones siendo mujer, cuando eso significaba renunciar al telar y a la casa"]],
 "Epicuro":[["Leontion","el placer y la amistad, y la osadía de polemizar en público con Teofrasto"]],
 "Aristipo":[["Arete de Cirene","el placer como guía de la vida, enseñado y transmitido por una mujer"]],
 "Plotino|Proclo|Porfirio":[["Hipatia de Alejandría","la contemplación neoplatónica unida a las matemáticas y a la enseñanza pública, hasta que la mataron por ello"]],
 "Agustín de Hipona|San Agustín|Agustin":[["Teresa de Ávila","la interioridad del alma, en una época en que se desconfiaba de que las mujeres rezaran por su cuenta"]],
 "Gregorio de Nisa":[["Macrina la Joven","el alma y la resurrección: en el diálogo es ella quien enseña"]],
 "Yajñavalkya|Yajnavalkya":[["Gargi Vachaknavi","el fundamento del universo, preguntando hasta que se le ordena callar"]],
 "Buda|Siddhartha":[["Kisa Gotami","el sufrimiento y su final, visto desde una madre que ha perdido a su hijo"]],
 "Confucio|Mencio":[["Ban Zhao","la educación y la virtud, defendiendo que las niñas también deben aprender"]],
 "Laozi|Lao Tse|Zhuangzi":[["Xie Daoyun","el misterio y la naturaleza, pensados desde la poesía"]],
 "Shankara":[["Lal Ded","la no-dualidad entre el yo y lo divino, cantada en lengua popular y fuera de los templos"]],
 "Rumi|Al-Ghazali|Ibn Arabi":[["Rabia al-Adawiyya","el amor a Dios sin miedo ni recompensa, desde la pobreza y fuera de toda institución"]],
 "Averroes|Avicena":[["Fátima al-Fihri","el saber, no escribiendo tratados sino creando el lugar donde se enseña"]],
 "Abelardo|Pedro Abelardo":[["Eloísa","la ética de la intención y del amor, desde quien pagó el precio de ese amor"]],
 "Tomás de Aquino|Tomas de Aquino|Santo Tomás":[["Hildegarda de Bingen","Dios y el orden de la naturaleza, desde la visión, la medicina y la música"]],
 "Maestro Eckhart|Eckhart":[["Margarita Porete","el alma que se vacía de sí misma; ella lo escribió antes y la quemaron por ello"]],
 "Juan de la Cruz|San Juan de la Cruz":[["Teresa de Ávila","el camino interior del alma, contado con humor y sentido práctico"]],
 "Erasmo|Petrarca":[["Christine de Pizan","el humanismo, pero contestando a la misoginia de los sabios"]],
 "Montaigne":[["Marie de Gournay","la costumbre y el prejuicio, aplicados a la igualdad de hombres y mujeres"]],
 "Descartes":[["Isabel de Bohemia","la razón y el cuerpo, pensados desde la enfermedad y el exilio: ¿cómo mueve un alma a un cuerpo?"]],
 "Hobbes|Bacon":[["Margaret Cavendish","la materia y la ciencia nueva, desde fuera de la Royal Society, que no admitía mujeres"]],
 "Spinoza":[["Anne Conway","una sola sustancia viva, pensada desde el dolor crónico"]],
 "Leibniz":[["Émilie du Châtelet","la fuerza y la razón suficiente, en un libro escrito para enseñar física a su hijo"]],
 "Newton":[["Émilie du Châtelet","la gravitación, traducida y corregida a contrarreloj antes de un parto que le costó la vida"]],
 "Galileo":[["Laura Bassi","la física experimental, enseñada en una universidad que le ponía límites por ser mujer"]],
 "Locke":[["Mary Astell","la libertad y el contrato, preguntando por qué no valen dentro del matrimonio"]],
 "Hume":[["Mary Shepherd","la causalidad y el conocimiento, rebatiendo su escepticismo"]],
 "Rousseau":[["Mary Wollstonecraft","la educación y la libertad que él negaba a Sofía, reclamadas para todas"]],
 "Voltaire|Condorcet":[["Olympe de Gouges","los derechos y la crítica del poder, extendidos a las ciudadanas y pagados con la guillotina"]],
 "Adam Smith":[["Sophie de Grouchy","la simpatía moral, explicada desde el cuerpo y la desigualdad"]],
 "Kant":[["Christine Korsgaard","la autonomía y la dignidad, extendidas también a los animales"]],
 "Hegel":[["Carla Lonzi","la dialéctica de la historia, leída desde quienes quedaron fuera de ella"]],
 "Goethe|Schiller":[["Germaine de Staël","el genio y la literatura, desde una mujer exiliada por Napoleón"]],
 "John Stuart Mill|Stuart Mill":[["Harriet Taylor Mill","la libertad y la igualdad, pensadas a dos manos y firmadas solo por él"]],
 "Comte":[["Harriet Martineau","la sociología, aplicada a la vida de las mujeres y de las personas esclavizadas"]],
 "Marx|Engels":[["Silvia Federici","el trabajo y la explotación, contando el trabajo doméstico que nadie paga"],["Rosa Luxemburgo","la revolución y la libertad de quien piensa diferente"]],
 "Bakunin|Kropotkin|Proudhon":[["Emma Goldman","la libertad contra el Estado, incluida la libertad del cuerpo y del amor"]],
 "Lenin|Trotsky":[["Alexandra Kollontai","la revolución, llevada a la familia, el amor y la sexualidad"]],
 "Gramsci|Lukács|Lukacs":[["Agnes Heller","la cultura y la conciencia, desde la vida cotidiana"]],
 "Kierkegaard|Camus":[["Simone Weil","la angustia, el absurdo y la fe, pensados desde el trabajo en la fábrica"]],
 "Nietzsche":[["Lou Andreas-Salomé","la vida, el cuerpo y el erotismo, desde una mujer que rechazó el matrimonio"]],
 "Freud":[["Luce Irigaray","el inconsciente y el deseo, preguntando qué pasa si el sujeto no es masculino"]],
 "Lacan":[["Julia Kristeva","el lenguaje y el sujeto, desde lo materno y lo semiótico"]],
 "Jung":[["Lou Andreas-Salomé","el alma y el narcisismo, desde una psicoanalista"]],
 "Peirce|Charles Peirce":[["Victoria Welby","el signo y el significado, desde fuera de la universidad"]],
 "William James":[["Mary Whiton Calkins","la conciencia y el yo; Harvard le negó el doctorado que se había ganado"]],
 "Dewey|John Dewey":[["Jane Addams","la democracia como forma de vida, practicada en un barrio de inmigrantes"]],
 "Husserl":[["Edith Stein","la conciencia y la empatía; a ella no la dejaron ser profesora por ser mujer"]],
 "Heidegger":[["Hannah Arendt","frente al ser-para-la-muerte, la natalidad: empezar algo nuevo, pensado desde una judía apátrida"]],
 "Jaspers":[["Jeanne Hersch","la existencia y la libertad, llevadas a los derechos humanos"]],
 "Sartre":[["Simone de Beauvoir","la libertad, pero situada: qué significa ser libre cuando te han hecho «la otra»"]],
 "Merleau-Ponty":[["Iris Marion Young","el cuerpo vivido, desde una chica a la que enseñan a moverse con miedo"]],
 "Levinas":[["Adriana Cavarero","la ética del otro, desde la voz y la vulnerabilidad de quien nace"]],
 "Ortega y Gasset|Ortega|Unamuno":[["María Zambrano","la razón vital convertida en razón poética, desde el exilio"]],
 "Wittgenstein|Austin":[["Rae Langton","el lenguaje como acción, y cómo se silencia a las mujeres al hablar"],["Elizabeth Anscombe","la intención: qué hacemos cuando decimos que queremos algo"]],
 "Russell|Bertrand Russell":[["Susan Stebbing","la lógica, puesta al servicio de defenderse de la propaganda"]],
 "Frege|Carnap|Gödel|Godel|Quine|Kripke":[["Ruth Barcan Marcus","la lógica de la necesidad y la identidad, que ella planteó antes y se le reconoció tarde"]],
 "Turing":[["Ada Lovelace","las máquinas que manipulan símbolos, un siglo antes y como «ciencia poética»"]],
 "Popper":[["Helen Longino","la objetividad científica, como fruto de la crítica colectiva y no de un individuo"]],
 "Kuhn":[["Evelyn Fox Keller","cómo cambia la ciencia, preguntando por el género de sus metáforas"]],
 "Feyerabend|Latour|Bruno Latour":[["Donna Haraway","la ciencia como práctica situada: no hay mirada desde ninguna parte"]],
 "Darwin|Lovelock|Dawkins":[["Lynn Margulis","la evolución por simbiosis y cooperación, no solo por competencia"]],
 "Dennett|Searle|Fodor":[["Patricia Churchland","la mente, estudiada desde el cerebro"]],
 "Peter Singer|Singer":[["Mary Midgley","los animales, sin olvidar que nosotros también lo somos"]],
 "MacIntyre":[["Philippa Foot","la virtud como forma de vida buena"]],
 "Rawls":[["Susan Moller Okin","la justicia, mirando dentro de la familia, que él dejó fuera"]],
 "Nozick":[["Elizabeth Anderson","la libertad, mirando el poder de los jefes en el trabajo"]],
 "Habermas|Apel":[["Seyla Benhabib","el diálogo racional con el otro concreto, no solo con el «otro generalizado»"]],
 "Adorno|Horkheimer":[["Gillian Rose","la teoría crítica, desde el duelo y la ley"]],
 "Marcuse":[["Angela Davis","la liberación, pensada desde la cárcel y el cuerpo negro"]],
 "Honneth|Axel Honneth|Rorty":[["Nancy Fraser","el reconocimiento, sin olvidar la redistribución económica"]],
 "Laclau":[["Chantal Mouffe","la hegemonía y el conflicto como corazón de la democracia"]],
 "Foucault":[["Judith Butler","el poder y el sujeto, llevados al género y a los cuerpos que no encajan"]],
 "Derrida":[["Hélène Cixous","la escritura y la diferencia, escritas desde el cuerpo de una mujer"]],
 "Deleuze|Guattari":[["Rosi Braidotti","el devenir y lo nómade, desde un sujeto feminista encarnado"]],
 "Agamben|Esposito":[["Adriana Cavarero","la vida expuesta, pensada desde la vulnerabilidad y la relación"]],
 "Byung-Chul Han|Han":[["Remedios Zafra","el cansancio y la autoexplotación, desde la precariedad del trabajo creativo"]],
 "Barthes|Roland Barthes|Saussure":[["Julia Kristeva","el signo y el texto, abiertos al cuerpo y al deseo"]],
 "Bourdieu":[["Janet Wolff","el arte como producción social, preguntando quién puede llegar a ser artista"]],
 "Fanon|Frantz Fanon":[["Sylvia Wynter","la colonialidad, desmontando la idea de «Hombre» como medida de lo humano"]],
 "Said|Edward Said":[["Gayatri Spivak","la representación del otro colonial, preguntando si la mujer subalterna puede hablar"]],
 "Dussel|Mignolo|Quijano":[["María Lugones","la colonialidad del poder, preguntando por la colonialidad del género"]],
 "Paulo Freire|Freire":[["bell hooks","la pedagogía liberadora, desde el aula, la raza y el amor"]],
 "Du Bois|W. E. B. Du Bois":[["Anna Julia Cooper","la raza en Estados Unidos, desde las mujeres negras"]],
 "Fred Moten|Moten":[["Audre Lorde","la poética negra, desde una lesbiana negra"],["Sylvia Wynter","la estética y el ser negro"]],
 "Lawrence Weiner|Weiner|Sol LeWitt|Kosuth":[["Lucy Lippard","el arte conceptual, y las artistas que se quedaban fuera de él"]],
 "Greenberg|Clement Greenberg":[["Rosalind Krauss","la forma moderna, abierta al «campo expandido»"]],
 "John Berger|Berger":[["Laura Mulvey","la mirada, desde quien es mirada"]],
 "Gombrich|Panofsky":[["Linda Nochlin","la historia del arte, preguntando por qué no hubo «grandes artistas mujeres»"]],
 "Berleant|Arnold Berleant|Allen Carlson":[["Yuriko Saito","la estética del entorno y de lo cotidiano: limpiar, ordenar, cuidar"]],
 "Tanizaki|Okakura":[["Sei Shōnagon","la sensibilidad japonesa, desde la vida de una dama de la corte"]],
 "Timothy Morton|Morton":[["Val Plumwood","la ecología, desde quien fue presa de un cocodrilo: también somos comida"]],
 "Duchamp|Hélio Oiticica|Oiticica":[["Lygia Clark","el objeto artístico, disuelto en la experiencia del cuerpo"]],
 "Lévi-Strauss|Levi-Strauss|Malinowski|Mauss":[["Marilyn Strathern","el intercambio y el parentesco, preguntando por el género del don"]],
 "Simmel|Benjamin|Walter Benjamin|Baudelaire":[["Janet Wolff","el paseante de la ciudad moderna, y por qué no podía haber flâneuse"]],
 "Feuerbach|Ludwig Feuerbach":[["George Eliot","tradujo «La esencia del cristianismo» al inglés y llevó su humanismo a la novela"],["Mary Daly","la religión como proyección humana, leída como proyección del patriarcado: más allá de Dios Padre"]],
 "Schopenhauer":[["Simone Weil","el sufrimiento y la compasión, sin pesimismo: la atención a quien sufre"]],
 "Bergson":[["Susanne Langer","el tiempo vivido y el sentimiento, convertidos en forma simbólica"]],
 "Heráclito|Heraclito":[["Cleobulina de Rodas","pensar con paradojas y enigmas, en la misma época"]],
 "Parménides|Parmenides":[["Gargi Vachaknavi","el fundamento único de todo, preguntado en la India de la misma época"]],
 "Tales|Tales de Mileto|Anaximandro|Anaxímenes|Anaximenes":[["Hipatia de Alejandría","el cosmos explicado con razón y matemática"]],
 "Demócrito|Democrito|Lucrecio":[["Margaret Cavendish","el mundo hecho de materia, pero de una materia viva que siente y piensa"]],
 "Zenón|Zenon|Zenón de Elea":[["Sulabha","la paradoja como arma para desmontar las certezas de un rey"]],
 "Séneca|Seneca|Epicteto|Marco Aurelio":[["Martha Nussbaum","la terapia del deseo: leyó a los estoicos y les discutió que las emociones sean errores"]],
 "Cicerón|Ciceron":[["Aspasia de Mileto","la retórica como arte político"]],
 "Boecio":[["Juliana de Norwich","la consolación ante la desgracia: «todo irá bien»"]],
 "Anselmo|San Anselmo|Buenaventura|Alberto Magno":[["Hildegarda de Bingen","Dios pensado desde la visión y la naturaleza"]],
 "Ockham|Guillermo de Ockham|Duns Escoto":[["Margarita Porete","la simplicidad radical: el alma simple que ya no quiere nada"]],
 "Maquiavelo|Bodin":[["Christine de Pizan","el arte de gobernar, escrito para príncipes un siglo antes y pensando también en las mujeres"]],
 "Tomás Moro|Tomas Moro|Campanella|Moro":[["Begum Rokeya","la utopía: «El sueño de Sultana», un país gobernado por mujeres"]],
 "Lutero|Calvino":[["Anna Maria van Schurman","la fe reformada y el derecho de las mujeres a estudiar"]],
 "Giordano Bruno|Bruno":[["Anne Conway","un universo infinito y vivo"]],
 "Pascal":[["Edith Stein","la razón y la fe, pensadas desde la conversión"]],
 "Malebranche|Berkeley":[["Mary Shepherd","el mundo exterior, defendido frente al idealismo de Berkeley"]],
 "Vico|Herder|Dilthey":[["Germaine de Staël","la cultura y el espíritu de los pueblos, leídos desde la literatura"]],
 "Montesquieu":[["Olympe de Gouges","las leyes y los derechos, reclamados para las ciudadanas"]],
 "Diderot|D'Alembert|Holbach|Helvétius|Helvetius|Condillac":[["Émilie du Châtelet","la Ilustración desde la física: escribió los fundamentos que ellos divulgaban"]],
 "Fichte|Schelling":[["Germaine de Staël","el idealismo alemán, presentado a Europa por una mujer exiliada"]],
 "Bentham|utilitarismo":[["Harriet Taylor Mill","la felicidad del mayor número, contando también la de las mujeres"]],
 "Tocqueville":[["Harriet Martineau","la democracia estadounidense, observada en los mismos años y con las mujeres y los esclavizados dentro"]],
 "Spencer|Durkheim":[["Harriet Martineau","la sociología, desde una de sus fundadoras"]],
 "Weber|Max Weber":[["Silvia Federici","los orígenes del capitalismo, contados desde la caza de brujas"]],
 "Thoreau|Emerson":[["Margaret Fuller","el trascendentalismo, desde la mujer que dirigió su revista"]],
 "Mead|George Herbert Mead":[["Jane Addams","el yo social y la democracia vivida en un barrio"]],
 "Scheler":[["Gerda Walther","la vida afectiva y la comunidad, desde la fenomenología"]],
 "Brentano":[["Edith Stein","la conciencia y la empatía"]],
 "Buber|Rosenzweig":[["Adriana Cavarero","el yo y el tú, desde la voz y la relación"]],
 "Gadamer":[["Barbara Cassin","comprender y traducir: lo que se resiste a pasar de una lengua a otra"]],
 "Ricoeur|Ricœur":[["Adriana Cavarero","la identidad narrativa: tú que me miras, tú que me cuentas"]],
 "Moore|G. E. Moore":[["Iris Murdoch","el bien, mirado con atención amorosa"]],
 "Ryle|Davidson":[["Elizabeth Anscombe","la mente y la acción: qué hacemos cuando actuamos por una razón"]],
 "Putnam|Strawson":[["Ruth Millikan","el significado, explicado desde la biología"]],
 "Whitehead":[["Isabelle Stengers","el pensamiento del proceso: le dedicó un gran libro"]],
 "Santayana|Croce|Collingwood":[["Susanne Langer","el arte como forma del sentimiento"]],
 "Bachelard":[["María Zambrano","la imaginación poética como forma de conocer"]],
 "Canguilhem":[["Evelyn Fox Keller","la vida y la biología, preguntando por sus metáforas"]],
 "Althusser|Negri":[["Silvia Federici","la reproducción de la sociedad, empezando por el trabajo doméstico"]],
 "Rancière|Ranciere":[["bell hooks","la igualdad de las inteligencias, puesta en práctica en el aula"]],
 "Badiou":[["Chantal Mouffe","la política como conflicto y acontecimiento"]],
 "Lyotard":[["Donna Haraway","la posmodernidad, con cíborgs en vez de nostalgia"]],
 "Baudrillard|Debord":[["Remedios Zafra","el espectáculo y la vida en pantallas, desde quien trabaja en ellas"]],
 "Žižek|Zizek":[["Judith Butler","Hegel, Lacan y la política del sujeto"]],
 "Sloterdijk":[["Rosi Braidotti","lo posthumano y nuestras esferas de vida"]],
 "Lakatos":[["Helen Longino","cómo avanza la ciencia: con crítica colectiva"]],
 "Chomsky":[["Ruth Millikan","el lenguaje, entendido como función biológica"]],
 "Nagel|Thomas Nagel":[["Patricia Churchland","la conciencia, estudiada desde el cerebro"]],
 "Parfit":[["Susan Wolf","el sentido de la vida y lo que de verdad importa"]],
 "Bernard Williams|Williams":[["Philippa Foot","la ética como forma de vida buena"]],
 "Charles Taylor|Taylor":[["Nancy Fraser","el reconocimiento, sin olvidar la redistribución"]],
 "Sandel":[["Elizabeth Anderson","la justicia y la igualdad entre ciudadanos"]],
 "Walzer":[["Iris Marion Young","la justicia y la política de la diferencia"]],
 "Amartya Sen|Sen":[["Martha Nussbaum","el enfoque de las capacidades, que desarrollaron juntos"]],
 "Bauman":[["Rahel Jaeggi","la alienación y las formas de vida de hoy"]],
 "Fromm|Erich Fromm":[["bell hooks","el arte de amar, como práctica política"]],
 "Ernst Bloch|Bloch":[["Begum Rokeya","el principio esperanza: imaginar un mundo mejor"]],
 "Zubiri|Gustavo Bueno":[["María Zambrano","la realidad y la razón, pensadas en español"]],
 "Savater":[["Adela Cortina","la ética para la ciudadanía"]],
 "Teilhard|Teilhard de Chardin":[["Hildegarda de Bingen","el cosmos vivo y lo divino en la naturaleza"]],
 "Krishnamurti|Nagarjuna":[["Machig Labdrön","soltar el apego al yo"]],
 "Al-Farabi|Ibn Khaldun|Maimónides|Maimonides":[["Fatema Mernissi","la historia del pensamiento islámico, contada con las mujeres dentro"]],
 "Mounier":[["Edith Stein","la persona y su dignidad"]],
 "Morin|Edgar Morin":[["Isabelle Stengers","pensar la complejidad sin simplificarla"]],
 "Mariátegui|Mariategui|José Martí|Marti":[["Silvia Rivera Cusicanqui","la cuestión indígena y la emancipación de América Latina"]],
 "Bataille":[["Audre Lorde","lo erótico como poder"]],
 "Plutarco|Diógenes Laercio":[["Christine de Pizan","escribir las vidas de mujeres ilustres que la historia olvidó"]],
 "Hesíodo|Hesiodo|Homero":[["Enheduana","los dioses y el poder, en la que quizá es la primera autora con nombre conocido"]]
};
const HOMK=Object.entries(HOM).map(([k,v])=>({alias:k.split('|'),name:k.split('|')[0],list:v}));
/* ¿lo buscado es un filósofo? Coincide con un alias (o con su apellido), tolerando erratas */
function homologa(q){
  if(q.length<3)return null;
  let best=null;
  for(const h of HOMK){
    for(const a of h.alias){
      const n=norm(a), last=n.split(' ').pop();
      let sc=0;
      if(n===q)sc=3; else if(n.startsWith(q)&&q.length>=4)sc=2.5; else if(q.length>=4&&(q===last||lev(q,n)<=(n.length>6?2:1)||lev(q,last)<=(last.length>6?2:1)))sc=2;
      else if(q.includes(n)&&n.length>=4)sc=1.5;
      if(sc&&(!best||sc>best.sc))best={h,sc,a};
    }
  }
  if(!best)return null;
  return {sc:best.sc,name:best.sc>=2&&best.a.length>3?best.a:best.h.name,list:best.h.list.map(([n,m])=>({p:P.find(x=>x.n===n),m})).filter(o=>o.p)};
}

/* ---------- conceptos: busca una idea y te recomendamos a una filósofa ---------- */
/* "raíces separadas por |": [[filósofa, por qué leerla sobre esto], …]  (la raíz casa con el comienzo de una palabra) */
const CONCEPTOS={
 "amor|amar|enamor|romant":[["Diotima de Mantinea","el amor como camino hacia lo bello y lo verdadero"],["bell hooks","el amor como práctica ética y política"],["Alexandra Kollontai","el amor libre de la propiedad y la familia burguesa"]],
 "deseo|sexo|sexual|erotis":[["Amia Srinivasan","quién desea a quién, y por qué eso también es político"],["Audre Lorde","lo erótico como poder"],["Lou Andreas-Salomé","el erotismo como fuerza de la vida"]],
 "muerte|morir|mortal|finitud":[["Kisa Gotami","no hay casa donde no haya entrado la muerte"],["Hannah Arendt","frente a la muerte, la natalidad"]],
 "duelo|perdida|pérdida|luto":[["Gillian Rose","el duelo como trabajo filosófico y político"],["Kisa Gotami","aceptar la pérdida"]],
 "nacer|nacimiento|natalidad":[["Hannah Arendt","nacer es poder empezar algo nuevo"],["Adriana Cavarero","cada quien es único desde que nace"]],
 "libertad|libre":[["Simone de Beauvoir","la libertad situada"],["Rosa Luxemburgo","la libertad es la de quien piensa diferente"]],
 "justicia|injusticia":[["Iris Marion Young","las cinco caras de la opresión"],["Martha Nussbaum","lo que cada persona necesita poder hacer y ser"]],
 "igualdad|desigualdad":[["Mary Wollstonecraft","la razón no tiene sexo"],["Elizabeth Anderson","la igualdad democrática"]],
 "trabajo|empleo|explotac|precari|mano de obra":[["Silvia Federici","el trabajo doméstico que sostiene todo lo demás"],["Simone Weil","la condición obrera vivida desde dentro"],["Remedios Zafra","la precariedad del trabajo creativo"]],
 "dinero|capital|economi|mercado|neoliberal":[["Silvia Federici","capitalismo, cuerpos y caza de brujas"],["Nancy Fraser","el capitalismo devora sus propias condiciones"],["Wendy Brown","cómo el neoliberalismo deshace la democracia"]],
 "cuidad|cuidar|cuidados|dependencia|etica del cuidado|ética del cuidado":[["Joan Tronto","el cuidado como cuestión democrática"],["Eva Feder Kittay","todos dependemos de alguien"],["Carol Gilligan","la ética del cuidado"]],
 "madre|maternidad|maternal|crianza|criar|hijos|hijas|bebé|bebés":[["Sara Ruddick","el pensamiento maternal"],["Luisa Muraro","el orden simbólico de la madre"]],
 "cuerpo|cuerpos|corporal|encarn":[["Elizabeth Grosz","cuerpos volátiles"],["Iris Marion Young","cómo nos enseñan a mover el cuerpo"],["Judith Butler","los cuerpos que importan"]],
 "genero|género|mujer|mujeres|femenin":[["Simone de Beauvoir","no se nace mujer: se llega a serlo"],["Judith Butler","el género como performatividad"]],
 "queer|lesbiana|gay|homosex|disidencia|salir del armario":[["Sara Ahmed","fenomenología queer"],["Monique Wittig","las lesbianas no son mujeres"]],
 "trans|travesti|transgénero|transgenero":[["Lohana Berkins","la identidad travesti como lucha política"],["Judith Butler","deshacer el género"]],
 "feminis":[["Simone de Beauvoir","el punto de partida"],["bell hooks","el feminismo es para todo el mundo"]],
 "violencia|violacion|violación|feminicid|maltrato":[["Rita Segato","la violencia como mandato de masculinidad"],["Marcela Lagarde","el concepto de feminicidio"]],
 "guerra|paz|militar":[["Simone Weil","la Ilíada o el poema de la fuerza"],["Sara Ruddick","pensamiento maternal para la paz"]],
 "mal|maldad|holocausto|totalitar":[["Hannah Arendt","la banalidad del mal"]],
 "poder|dominacion|dominación|opresion|opresión":[["Judith Butler","el poder que nos hace sujetos"],["Marilyn Frye","la opresión como jaula de pájaro"]],
 "democracia|ciudadan|participac":[["Jane Addams","la democracia como forma de vida"],["Chantal Mouffe","el conflicto en el corazón de la democracia"]],
 "politica|política":[["Hannah Arendt","la acción entre iguales"],["Chantal Mouffe","lo político como antagonismo"]],
 "raza|racismo|racial|negr|blanquitud":[["Angela Davis","mujeres, raza y clase"],["Kimberlé Crenshaw","la interseccionalidad"],["Audre Lorde","las herramientas del amo"]],
 "interseccional":[["Kimberlé Crenshaw","acuñó la palabra"],["Patricia Hill Collins","la matriz de dominación"]],
 "colonial|colonia|descoloni|decoloni":[["María Lugones","la colonialidad del género"],["Gayatri Spivak","¿puede hablar el subalterno?"],["Silvia Rivera Cusicanqui","lo ch'ixi"]],
 "indigena|indígena|originari|ancestral":[["Silvia Rivera Cusicanqui","pensamiento aymara y lo ch'ixi"],["Linda Tuhiwai Smith","descolonizar la investigación"],["Lorena Cabnal","cuerpo-territorio"]],
 "territorio|tierra|extractiv|mineria|minería":[["Lorena Cabnal","defender la tierra es defender el cuerpo"],["Maristella Svampa","el extractivismo"]],
 "frontera|migra|exilio|mestiz":[["Gloria Anzaldúa","la conciencia mestiza de la frontera"],["María Zambrano","el exilio como lugar de pensamiento"]],
 "carcel|cárcel|prision|prisión|castigo|delito":[["Angela Davis","abolir las prisiones"],["Concepción Arenal","las cárceles de mujeres y la reforma penal"]],
 "esclav":[["Sojourner Truth","¿acaso no soy una mujer?"],["Anna Julia Cooper","una voz del Sur"]],
 "pobreza|pobre|aporofob":[["Adela Cortina","la aporofobia, el rechazo al pobre"]],
 "naturaleza|ecolog|medio ambiente|ambiental|clima":[["Val Plumwood","el dualismo que nos separa de la naturaleza"],["Donna Haraway","seguir con el problema"],["Rachel Carson","primavera silenciosa"]],
 "animal|animales|especie|veganism":[["Mary Midgley","somos animales"],["Christine Korsgaard","nuestras obligaciones con los animales"],["Donna Haraway","especies de compañía"]],
 "planta|semilla|agricultur|bosque|arbol|árbol":[["Vandana Shiva","las semillas y la biodiversidad"],["Wangari Maathai","plantar árboles como democracia"]],
 "evolucion|evolución|biolog|vida|simbiosis|celula|célula":[["Lynn Margulis","la vida evoluciona por simbiosis"]],
 "ciencia|cientific|científic|objetividad":[["Donna Haraway","los conocimientos situados"],["Sandra Harding","la objetividad fuerte"]],
 "matematic|matemátic|numero|número|geometr":[["Hipatia de Alejandría","matemáticas y filosofía en Alejandría"],["Émilie du Châtelet","física y metafísica"]],
 "fisica|física|cuantic|cuántic|gravedad":[["Émilie du Châtelet","tradujo y comentó a Newton"],["Karen Barad","física cuántica y realismo agencial"]],
 "logica|lógica|argument|razonam":[["Ruth Barcan Marcus","lógica modal"],["Susan Stebbing","pensar con propósito frente a la propaganda"]],
 "inteligencia artificial|ia|algoritm|maquina|máquina|ordenador|computa|robot":[["Margaret Boden","creatividad e inteligencia artificial"],["Ada Lovelace","la primera en imaginar máquinas que manipulan símbolos"]],
 "tecnolog|ciborg|cíborg|cyborg|posthuman|digital":[["Donna Haraway","el manifiesto cíborg"],["Rosi Braidotti","lo posthumano"]],
 "internet|redes sociales|pantalla|entusiasmo|movil|móvil|smartphone|selfie|instagram|tiktok|influencer|youtube|likes":[["Remedios Zafra","el entusiasmo y la vida conectada; «Ojos y capital»: mirar y ser mirada en las pantallas"],["Shoshana Zuboff","«La era del capitalismo de la vigilancia»: lo que las apps hacen con tus datos"]],
 "mente|conciencia|consciencia|cerebro":[["Patricia Churchland","la mente desde el cerebro"],["Isabel de Bohemia","el problema mente-cuerpo"]],
 "emocion|emoción|sentimiento|afect":[["Martha Nussbaum","la inteligencia de las emociones"],["Sara Ahmed","la política cultural de las emociones"]],
 "empatia|empatía|compasion|compasión|simpatia|simpatía":[["Edith Stein","sobre el problema de la empatía"],["Sophie de Grouchy","cartas sobre la simpatía"]],
 "felicidad|alegria|alegría|bienestar":[["Sara Ahmed","la promesa de la felicidad"],["Arete de Cirene","el placer como guía"]],
 "placer|hedon|disfrut":[["Arete de Cirene","el hedonismo cirenaico"],["Leontion","el placer epicúreo"]],
 "ansiedad|angustia|depresion|depresión|tristeza|melancol|sufrimiento|dolor":[["Simone Weil","la desgracia y la atención"],["Kisa Gotami","el sufrimiento compartido"],["Juliana de Norwich","todo irá bien"]],
 "atencion|atención|concentra":[["Simone Weil","la atención es la forma más rara de generosidad"],["Iris Murdoch","mirar con justicia lo real"]],
 "silencio|meditac|contemplac|soledad|retiro":[["Machig Labdrön","cortar el apego al yo"],["Teresa de Ávila","el castillo interior"]],
 "dios|divin|religi|fe|espiritual|alma":[["Teresa de Ávila","el castillo interior del alma"],["Hildegarda de Bingen","lo divino en la naturaleza"],["Rabia al-Adawiyya","amar a Dios sin miedo ni recompensa"]],
 "mistic|místic":[["Margarita Porete","el espejo de las almas simples"],["Hadewijch de Amberes","el amor como abismo"]],
 "sueño|sueños|inconsciente|psicoanal|deseo inconsciente":[["Lou Andreas-Salomé","psicoanálisis y narcisismo"],["Julia Kristeva","lo semiótico y lo abyecto"]],
 "lenguaje|palabra|hablar|signo|semiot|semiót":[["Julia Kristeva","lo semiótico"],["Rae Langton","el lenguaje como acción"]],
 "silenciad|testimonio|credibilidad|injusticia epist":[["Miranda Fricker","la injusticia epistémica"]],
 "traduc|lengua|idioma|intraducib":[["Barbara Cassin","el vocabulario de los intraducibles"],["Yásnaya Elena Aguilar","el derecho a existir en otra lengua"]],
 "verdad|conocimiento|saber|epistem":[["Sandra Harding","quién conoce y desde dónde"],["Miranda Fricker","la injusticia de no ser creída"]],
 "educacion|educación|escuela|enseñ|pedagog|aprender":[["bell hooks","enseñar a transgredir"],["Maria Montessori","la infancia que se educa a sí misma"]],
 "infancia|niñ|niñez":[["Maria Montessori","la mente absorbente de la infancia"],["Ellen Key","el siglo de los niños"]],
 "belleza|bello|bella":[["Elaine Scarry","la belleza nos prepara para la justicia"],["Mary Mothersill","la belleza recuperada"]],
 "arte|artista|museo|pintura":[["Linda Nochlin","¿por qué no ha habido grandes artistas mujeres?"],["Lygia Clark","el arte como experiencia del cuerpo"]],
 "cine|pelicula|película|mirada|imagen|series|television|televisión":[["Laura Mulvey","la mirada masculina"]],
 "estetica|estética|gusto":[["Yuriko Saito","la estética de lo cotidiano"],["Carolyn Korsmeyer","el sentido del gusto"]],
 "comida|cocina|comer|gusto|sabor|taza$|tazas|cuchara|tenedor|cuchillo|plato$|platos$|olla$|ollas|sarten|sartén|vaso$|vasos$|cafe$|café|pan$|desayuno|cena$|receta|recetas|nevera":[["Carolyn Korsmeyer","la comida como asunto filosófico"]],
 "casa|hogar|cotidian|limpiar|ordenar|domestic|doméstic|manta|mantas|sofa|sofá|cama$|camas$|cojin|cojín|cojines|sabanas|sábanas|lavadora|escoba|fregona|plancha|planchar|nevera|lavavajillas|fregar|colada|mueble|muebles|lampara|lámpara|ventana|ventanas|puerta|puertas|llaves|cortina|cortinas":[["Yuriko Saito","la estética de la vida diaria"],["Agnes Heller","la vida cotidiana"]],
 "ciudad|calle|urban|pasear|flaneur|flâneur|coche|coches|bici$|bicicleta|autobus|autobús|metro$|tren$|trenes|trafico|tráfico|semaforo|semáforo":[["Janet Wolff","la flâneuse invisible"]],
 "arquitect|diseño|diseno":[["María Mallo","geometrías naturales en arquitectura"],["Anni Albers","pensar con las manos"]],
 "musica|música|sonido|armonia|armonía":[["Hildegarda de Bingen","música y visión"],["Ptolemaida de Cirene","la armonía, ¿razón u oído?"]],
 "poesia|poesía|poetic|poétic|escritura|escribir":[["María Zambrano","la razón poética"],["Hélène Cixous","escribir el cuerpo"]],
 "tiempo|historia|memoria|reloj|relojes|calendario|agenda":[["Hannah Arendt","entre el pasado y el futuro"],["Nelly Richard","arte y memoria"]],
 "voz|narrar|relato|historia de vida":[["Adriana Cavarero","tú que me miras, tú que me cuentas"]],
 "discapacidad|diversidad funcional":[["Eva Feder Kittay","la dignidad de la dependencia"]],
 "velo|islam|corán|coran|musulman":[["Fatema Mernissi","el harén político"],["Leila Ahmed","mujeres y género en el islam"]],
 "bruja|brujas|hechic":[["Silvia Federici","Calibán y la bruja"]],
 "misogin|machismo|patriarc|masculin":[["Kate Manne","la lógica de la misoginia"],["Rita Segato","el mandato de masculinidad"]],
 "confianza|confiar":[["Annette Baier","la confianza como centro de la vida moral"],["Onora O'Neill","confianza en las instituciones"]],
 "virtud|bien|bondad|moral|etica|ética":[["Iris Murdoch","la soberanía del bien"],["Philippa Foot","la bondad natural"]],
 "envidia|irritacion|irritación|rencor":[["Sianne Ngai","«Ugly Feelings»: la envidia, la irritación y otros sentimientos feos"]],
 "celos|celoso|celosa":[["Brigitte Vasallo","los celos, pensados desde fuera de la monogamia"],["Sianne Ngai","«Ugly Feelings»: los sentimientos feos"]],
 "cuqui|kawaii|adorable|lo mono|monada|monadas":[["Sianne Ngai","«Our Aesthetic Categories»: lo mono, lo chiflado y lo interesante"]],
 "embarazo|embarazada|parto|parir|gestacion|gestación":[["Iris Marion Young","«Pregnant Embodiment»: vivir el embarazo desde dentro"],["Shulamith Firestone","«La dialéctica del sexo»: liberar a las mujeres de la carga de gestar"]],
 "lactancia|amamantar|pecho|pechos|teta|tetas":[["Iris Marion Young","«Breasted Experience»: los pechos vividos, no mirados"]],
 "menstruacion|menstruación|regla":[["Iris Marion Young","«Menstrual Meditations»: la regla como experiencia del cuerpo"]],
 "menopausia|climaterio":[["Germaine Greer","«The Change»: la menopausia sin miedo"]],
 "boda|bodas|casarse|divorcio|divorciar|soltera|soltería|solteria":[["Mary Astell","«Some Reflections upon Marriage» (1700): pensarse antes de casarse"],["Harriet Taylor Mill","el matrimonio y el divorcio, en sus ensayos con John Stuart Mill"]],
 "poliamor|monogamia|monogamo|monógamo|amor libre|pareja abierta":[["Brigitte Vasallo","«Pensamiento monógamo, terror poliamoroso»"],["Emma Goldman","«Matrimonio y amor»: el amor libre"]],
 "consentimiento|ligar|tinder|apps de citas|primera cita":[["Amia Srinivasan","«El derecho al sexo»: el deseo, las apps y la política"]],
 "pornografia|pornografía|porno":[["Catharine MacKinnon","«Only Words»: la pornografía como práctica, no solo como palabra"],["Rae Langton","«Speech Acts and Unspeakable Acts»: la pornografía que silencia"]],
 "acoso|piropo|piropos|acoso callejero|acoso laboral":[["Catharine MacKinnon","«Sexual Harassment of Working Women» (1979): el acoso como discriminación"]],
 "deuda|deudas|hipoteca|credito|crédito|prestamo|préstamo|endeudamiento":[["Verónica Gago","«Una lectura feminista de la deuda», con Luci Cavallero"]],
 "sueldo|salario|nomina|nómina|cobrar":[["Silvia Federici","«Salario contra el trabajo doméstico» (1975)"]],
 "vivienda|alquiler|desahucio|barrio|vecinos|vecindario|vecina":[["Jane Addams","Hull House: pensar la ciudad desde un barrio obrero de Chicago"]],
 "perro|perros|gato|gatos|mascota|mascotas|especies de compañia|especies de compañía":[["Donna Haraway","«Manifiesto de las especies de compañía»: vivir con perros"],["Mary Midgley","«Animals and Why They Matter»"]],
 "jardin|jardín|jardineria|jardinería|huerto":[["Yuriko Saito","la estética de los jardines japoneses"],["Vandana Shiva","las semillas y la tierra que se cultiva"]],
 "basura|residuos|reciclar|reciclaje|plastico|plástico":[["Jane Bennett","«Materia vibrante»: empieza con la basura de una alcantarilla de Baltimore"]],
 "reparar|arreglar|remendar|reparacion|reparación|kintsugi":[["Yuriko Saito","«Estética cotidiana»: el valor de lo reparado"]],
 "carta|cartas|correspondencia|mensajes|whatsapp":[["Isabel de Bohemia","sus cartas a Descartes"],["Eloísa","sus cartas a Abelardo"]],
 "consumo|consumir|compras|comprar|consumismo":[["Hannah Arendt","«La condición humana»: la sociedad de consumo"]],
 "sororidad|hermanas|amigas|hermandad":[["Marcela Lagarde","la sororidad: la alianza entre mujeres"]],
 "adolescencia|adolescente|juventud|jovenes|jóvenes":[["Simone de Beauvoir","«El segundo sexo»: el capítulo «La joven»"]],
 "juguete|juguetes|muñeca|muñecas":[["Simone de Beauvoir","«El segundo sexo»: lo que la muñeca enseña a la niña"]],
 "piedra|piedras|roca$|rocas$|trasto|trastos|cachivache|cosa|cosas|objeto|objetos|ente|entes|ontico|óntico|ontica|óntica|onticas|ónticas|ser-ahi|materia viva":[["Jane Bennett","«Materia vibrante»: el poder de las cosas, que también actúan"],["Edith Stein","«Ser finito y ser eterno»: qué es ser algo"],["Hedwig Conrad-Martius","una ontología realista de las cosas y los seres vivos"]],
 "flor$|flores|rosa$|rosas$|ramo|petalo|pétalo|petalos|pétalos|florecer":[["Hildegarda de Bingen","«Physica»: las plantas y sus virtudes"],["Sei Shōnagon","«El libro de la almohada»: listas de cosas bellas, flores incluidas"]],
 "mesa$|mesas$|silla$|sillas$|escritorio":[["Sara Ahmed","«Fenomenología queer»: empieza por la mesa en la que se escribe"]],
 "espejo|espejos|reflejo":[["Luce Irigaray","«Espéculo de la otra mujer»: el espejo en el que la filosofía se mira"]],
 "mar$|mares$|oceano|océano|playa|playas|olas$":[["Rachel Carson","«El mar que nos rodea»"]],
 "luna$|planeta|planetas|cielo nocturno|eclipse":[["Wang Zhenyi","explicó los eclipses de luna con una lámpara y un espejo"],["Hipatia de Alejandría","astronomía en Alejandría"]],
 "almohada|almohadas":[["Sei Shōnagon","«El libro de la almohada»: notas de cosas que conmueven, molestan o encantan"]],
 "vagina|vaginas|vulva|vulvas|clitoris|clítoris|coño|labios vaginales|sexo femenino":[["Luce Irigaray","«Ese sexo que no es uno»: un sexo plural, que no se mide con el masculino"],["Audre Lorde","«Usos de lo erótico»: lo erótico como poder"]],
 "pene|penes|falo$|falos$|falico|fálico|falocentr|polla|pollas|testiculo|testículo|testiculos|testículos":[["Luce Irigaray","contra el falocentrismo: la cultura medida con un solo sexo"],["Judith Butler","«El falo lesbiano», en «Cuerpos que importan»"]],
 "pelo$|pelos$|cabello|cabellos|peinado|peinados|melena|rizos|trenzas|afro$|alisar|alisado|calva$|calvicie":[["bell hooks","«Straightening Our Hair»: alisarse el pelo, belleza y racismo"]],
 "brazo|brazos|pierna|piernas|hombro|hombros|musculo|músculo|musculos|músculos":[["Iris Marion Young","«Lanzar como una chica»: el brazo que no se atreve a ocupar espacio"]],
 "mano$|manos$|dedo$|dedos$|tacto|tocar|caricia|caricias":[["Lygia Clark","«Diálogo de manos»: obras que solo existen al tocarlas"],["Iris Marion Young","el cuerpo vivido, de las manos a los pies"]],
 "utero|útero|uteros|úteros|ovario|ovarios|matriz$|vientre":[["Shulamith Firestone","«La dialéctica del sexo»: liberar a las mujeres de la carga de gestar"],["Iris Marion Young","«Pregnant Embodiment»: vivir el embarazo desde dentro"]],
 "corazon|corazón|corazones":[["Gertrudis de Helfta","una espiritualidad del corazón: la «libertad de corazón»"],["Martha Nussbaum","«Paisajes del pensamiento»: la inteligencia de las emociones"]],
 "ojo$|ojos$|cara$|caras$|rostro|rostros":[["Laura Mulvey","la mirada: quién mira y quién es mirada"]],
 "boca$|bocas$|labio$|labios$|beso$|besos$|besar":[["Luce Irigaray","los labios que se tocan: una imagen de lo femenino"]],
 "piel$|pieles$|color de piel":[["Sara Ahmed","«La política cultural de las emociones»: lo que se pega a los cuerpos"],["bell hooks","raza, belleza y mirada"]],
 "amistad|amig":[["Leontion","la amistad epicúrea"],["Hannah Arendt","la amistad política"]],
 "pelota|balon|balón|deporte|deportes|deportista|futbol|fútbol|atleta|atletismo|gimnasia|ejercicio fisico|ejercicio físico|lanzar|competicion|competición":[["Iris Marion Young","«Lanzar como una chica»: por qué a las niñas se les enseña a moverse con miedo a ocupar espacio"],["Simone de Beauvoir","«El segundo sexo»: el deporte y la pelea como formas de afirmarse en el mundo, negadas a las chicas"]],
 "juego|jugar|ludic|lúdic":[["María Lugones","la actitud lúdica: jugar para poder viajar al mundo de otras personas"]],
 "danza|baile|bailar|coreograf":[["Susanne Langer","«Sentimiento y forma»: la danza como imagen de fuerzas vivas"]],
 "viaje|viajes|viajar|turismo|peregrin":[["Flora Tristán","«Peregrinaciones de una paria»: su viaje al Perú"],["Mary Wollstonecraft","«Cartas desde Suecia, Noruega y Dinamarca»"],["María Lugones","«viajar» entre mundos con amor"]],
 "humor|risa|reir|reír|comedia|chiste":[["Hélène Cixous","«La risa de la Medusa»"],["Sara Ahmed","la aguafiestas feminista: no reírse de lo que no tiene gracia"]],
 "moda|ropa|vestir|vestido|vestidos|maquillaje|camiseta|camisetas|camisa|zapatilla|zapatillas|deportivas|zapato|zapatos|tacon|tacón|tacones|falda|faldas|pantalon|pantalón|pantalones|vaqueros|jersey|abrigo|chaqueta|bolso|bolsos|sujetador|lenceria|lencería|bikini|calcetines|pijama|gorra|sombrero|uniforme|armario|tallas|outfit":[["Iris Marion Young","«Las mujeres recuperan nuestra ropa»: el placer de vestirse"],["Susan Sontag","«Notas sobre lo camp»: el gusto por el artificio"]],
 "paisaje|montaña|senderismo|aire libre|caminar|pasear|camino|caminos|paseo":[["Emily Brady","apreciar el paisaje con imaginación y respeto, no como un cuadro"],["Yuriko Saito","«The Aesthetics of Unscenic Nature»: valorar también el paisaje que no sale en las postales"]],
 "cansancio|agotamiento|burnout|productividad|estres|estrés|agobio|prisa":[["Remedios Zafra","el entusiasmo y la autoexplotación"]],
 "abortar|aborto":[["Judith Jarvis Thomson","una defensa del aborto"]],
 "humano|humanidad|naturaleza humana":[["Sylvia Wynter","desmontar el «Hombre» como medida de lo humano"],["Mary Midgley","bestia y hombre"]],
 "cosmos|universo|astronom|estrella":[["Hipatia de Alejandría","astronomía en Alejandría"],["Wang Zhenyi","los eclipses explicados"]],
 "nihilis|nihilista":[["Simone de Beauvoir","en «Para una moral de la ambigüedad» retrata al nihilista y le responde con una libertad compartida"],["Lou Andreas-Salomé","conoció de cerca a Nietzsche y pensó una vida que se afirma a sí misma"],["Helene von Druskowitz","una de las primeras críticas de Nietzsche"]],
 "existencialis|absurdo|sinsentido|sentido de la vida":[["Simone de Beauvoir","el existencialismo, con la libertad siempre situada"],["Susan Wolf","qué hace que una vida tenga sentido"]],
 "nada|vacio|vacío":[["Margarita Porete","el alma que se vacía de sí misma"],["Machig Labdrön","cortar el apego al yo"]],
 "ser|ontolog|metafisic|metafísic":[["Edith Stein","«Ser finito y ser eterno»"],["Hedwig Conrad-Martius","una ontología realista de la naturaleza"],["Anne Conway","una metafísica de la sustancia viva"]],
 "fenomenolog":[["Edith Stein","la empatía, desde la fenomenología"],["Sara Ahmed","fenomenología queer"]],
 "hermeneut|interpretac":[["Susan Sontag","«Contra la interpretación»"],["Barbara Cassin","comprender lo que se resiste a la traducción"]],
 "dialectic|dialéctic":[["Raya Dunayevskaya","la dialéctica de Hegel y Marx como filosofía de la liberación"],["Carla Lonzi","la dialéctica de la historia, leída desde quienes quedaron fuera"]],
 "materialis":[["Margaret Cavendish","una materia viva que siente y piensa"],["Karen Barad","los nuevos materialismos: la materia como intra-acción"]],
 "idealis":[["Mary Whiton Calkins","un idealismo personalista"],["Germaine de Staël","presentó el idealismo alemán a Europa"]],
 "empiris|experiencia":[["Catharine Trotter Cockburn","defendió a Locke y el conocimiento por la experiencia"],["Mary Shepherd","la experiencia y la causalidad, contra Hume"]],
 "racionalis|razon|razón|racional":[["Genevieve Lloyd","«The Man of Reason»: la razón pensada en masculino"],["María Zambrano","la razón poética"]],
 "esceptic|escéptic|duda":[["Mary Shepherd","rebatió el escepticismo de Hume sobre la causalidad"],["Susan Haack","cómo justificar lo que creemos"]],
 "estoic":[["Martha Nussbaum","«La terapia del deseo»: leyó a los estoicos y discutió que las emociones sean errores"]],
 "cinism|cínic|cinic":[["Hiparquia de Maronea","la filósofa cínica que vivió sin convenciones"]],
 "utilitaris":[["Harriet Taylor Mill","la felicidad del mayor número, contando también la de las mujeres"]],
 "marxis|comunis|socialis":[["Rosa Luxemburgo","la revolución y la libertad de quien piensa diferente"],["Alexandra Kollontai","el socialismo llevado al amor y la familia"],["Raya Dunayevskaya","humanismo marxista"]],
 "anarquis|anarqu":[["Emma Goldman","la libertad contra el Estado, también la del cuerpo"],["Voltairine de Cleyre","un anarquismo sin adjetivos"]],
 "liberalis":[["Harriet Taylor Mill","la libertad individual extendida a las mujeres"],["Mary Wollstonecraft","los derechos de la Ilustración, reclamados para todas"]],
 "positivis":[["Harriet Martineau","tradujo y condensó a Comte"]],
 "pragmatis":[["Jane Addams","la democracia como forma de vida"]],
 "posmodern":[["Donna Haraway","el manifiesto cíborg"],["Rosi Braidotti","sujetos nómades"]],
 "deconstruc":[["Hélène Cixous","escribir el cuerpo"],["Sarah Kofman","leer a Nietzsche y Freud con la deconstrucción"]],
 "ecofemin":[["Vandana Shiva","las semillas y la biodiversidad"],["Val Plumwood","el dualismo que nos separa de la naturaleza"]],
 "sabiduria|sabiduría|sabio|sabia":[["Diotima de Mantinea","la sabiduría que enseña a Sócrates"],["Khema","según la tradición, la primera en sabiduría entre las discípulas del Buda"]],
 "ateis|ateís|ateo|atea":[["George Eliot","dejó la fe y tradujo a Feuerbach"],["Ayn Rand","una ética sin religión"]],
 "identidad":[["Linda Martín Alcoff","identidades visibles"],["Judith Butler","la identidad de género como performatividad"]],
 "otredad|alteridad|la otra|el otro":[["Simone de Beauvoir","la mujer convertida en «la Otra»"],["Gayatri Spivak","el otro colonial"]],
 "vejez|envejec|anciana|mayores|abuela|abuelo|abuelos|jubilacion|jubilación|arrugas":[["Simone de Beauvoir","«La vejez»: cómo la sociedad trata a quien envejece"]],
 "ira|rabia|enfado|cabreo":[["Audre Lorde","«Los usos de la ira»: la rabia de las mujeres negras como fuerza"]],
 "miedo":[["Martha Nussbaum","«La monarquía del miedo»"]],
 "verguenza|vergüenza|culpa|asco|repugnancia":[["Martha Nussbaum","«El ocultamiento de lo humano»: repugnancia, vergüenza y ley"]],
 "perdon|perdón|promesa":[["Hannah Arendt","el perdón y la promesa como capacidades de la acción"]],
 "mentira|posverdad|propaganda|bulo":[["Hannah Arendt","«Verdad y política»"],["Susan Stebbing","pensar con propósito para defenderse de la propaganda"]],
 "deber|obligac":[["Onora O'Neill","deberes y justicia más allá de las fronteras"],["Christine Korsgaard","las fuentes de la normatividad"]],
 "voluntad|intencion|intención|accion|acción":[["Elizabeth Anscombe","«Intención»"],["Hannah Arendt","la acción como forma de empezar algo nuevo"]],
 "destino|azar|suerte|fortuna|fragilidad":[["Martha Nussbaum","«La fragilidad del bien»: la suerte en la ética griega"]],
 "derechos humanos|derechos":[["Jeanne Hersch","los derechos humanos como exigencia filosófica"],["Olympe de Gouges","los derechos de la mujer y la ciudadana"]],
 "estado|gobierno|gobernar":[["Christine de Pizan","el arte de gobernar, para príncipes y para todas"],["Hannah Arendt","los orígenes del totalitarismo"]],
 "revolucion|revolución":[["Rosa Luxemburgo","la revolución con libertad"],["Hannah Arendt","«Sobre la revolución»"]],
 "utopia|utopía":[["Begum Rokeya","«El sueño de Sultana», una utopía feminista"]],
 "lectura|leer|libro|libros":[["Sor Juana Inés de la Cruz","el derecho de las mujeres a saber"]],
 "espacio|habitar|lugar":[["Yuriko Saito","la estética de los lugares y las cosas cotidianas"]],
 "infinit":[["Anne Conway","un universo infinito y vivo"],["Tullia d'Aragona","«Diálogo sobre la infinitud del amor»"]],
 "datos|vigilancia|privacidad|intimidad|cookies|algoritmo de recomendacion":[["Shoshana Zuboff","el capitalismo de la vigilancia"]],
 "alquimia|quimica|química":[["María la Judía","la alquimia de Alejandría"]],
 "familia|matrimonio|pareja":[["Susan Moller Okin","la justicia dentro de la familia"],["Alexandra Kollontai","el amor y la familia más allá de la propiedad"]],
 "universidad|doctorado|academia":[["Elena Cornaro Piscopia","la primera mujer doctorada en una universidad, en 1678"]],
 "medicina|salud|enfermedad|enfermo":[["Oliva Sabuco","las emociones y la salud del cuerpo"],["Hildegarda de Bingen","medicina y naturaleza"]],
 "locura|psiquiatr|manicomio|salud mental":[["Kate Millett","escribió sobre su propio internamiento psiquiátrico"],["Lou Andreas-Salomé","la psique, desde el psicoanálisis"]],
 "derecho|ley|leyes|juridic|jurídic|justicia penal":[["Catharine MacKinnon","el derecho pensado desde las mujeres: el acoso sexual como discriminación"],["Concepción Arenal","la reforma penal, pensada desde las cárceles de mujeres"]],
 "bioetic|bioétic|eutanasia|embrion|embrión":[["Mary Warnock","bioética pública: embriones y reproducción asistida"],["Judith Jarvis Thomson","«Una defensa del aborto»"]],
 "sociedad|social|sociolog":[["Harriet Martineau","una de las fundadoras de la sociología"],["Jane Addams","la ética social puesta en práctica"]],
 "cultura|cultural":[["Germaine de Staël","la literatura y las instituciones de cada pueblo"],["Rahel Jaeggi","la crítica de las formas de vida"]],
 "teoria critica|teoría crítica|frankfurt":[["Nancy Fraser","teoría crítica: redistribución y reconocimiento"],["Seyla Benhabib","teoría crítica y ética del diálogo"]],
 "valor|valores|axiolog":[["Iris Murdoch","la soberanía del bien"]],
 "presocratic|presocrátic":[["Teano","pitagórica"],["Temistoclea","la sacerdotisa de Delfos que enseñó ética a Pitágoras, según la tradición"],["Cleobulina de Rodas","enigmas y paradojas"]],
 "filosofia antigua|filosofía antigua|grecia|griega|griegos|clasica|clásica":[["Hipatia de Alejandría","la gran maestra de la Antigüedad tardía"],["Diotima de Mantinea","la voz del amor en el Banquete"],["Aspasia de Mileto","la retórica en la Atenas de Pericles"]],
 "helenis|helenístic|helenistic":[["Hiparquia de Maronea","la filósofa cínica"],["Leontion","la epicúrea"]],
 "patristic|patrístic|padres de la iglesia":[["Macrina la Joven","el alma y la resurrección"]],
 "escolastic|escolástic":[["Eloísa","la ética de la intención, en diálogo con Abelardo"],["Elena Cornaro Piscopia","doctora en filosofía escolástica en 1678"]],
 "medieval|edad media":[["Hildegarda de Bingen","naturaleza, visión y música"],["Christine de Pizan","la ciudad de las damas"]],
 "renacimiento|humanismo|humanista":[["Isotta Nogarola","humanista: ¿pecó más Eva o Adán?"],["Moderata Fonte","«El mérito de las mujeres»"]],
 "modernidad|filosofia moderna|filosofía moderna":[["Isabel de Bohemia","el problema mente-cuerpo, en carta a Descartes"],["Margaret Cavendish","la filosofía natural de la nueva ciencia"]],
 "ilustracion|ilustración|ilustrad":[["Émilie du Châtelet","la física de la Ilustración"],["Mary Wollstonecraft","la razón no tiene sexo"],["Celia Amorós","el feminismo como hijo de la Ilustración"]],
 "romantic|romántic|romanticismo":[["Germaine de Staël","llevó el Romanticismo alemán a Francia"],["Karoline von Günderrode","poeta romántica"]],
 "analitic|analític|filosofia analitica|filosofía analítica":[["Elizabeth Anscombe","«Intención»"],["Ruth Barcan Marcus","lógica modal"]],
 "continental":[["Simone de Beauvoir","existencialismo"],["Hannah Arendt","la acción y la política"]],
 "pitagor|pitagór":[["Teano","número, armonía y vida diaria"]],
 "sofist|sofíst|retorica|retórica":[["Aspasia de Mileto","maestra de retórica"],["Barbara Cassin","los sofistas y el poder de la palabra"]],
 "platonis|platónic|platonic":[["Diotima de Mantinea","la escala del amor"],["Lastenia de Mantinea","alumna de la Academia"]],
 "aristotel|aristotél":[["Philippa Foot","la virtud como bien natural"],["Elizabeth Anscombe","la renovación de la ética de la virtud"]],
 "neoplaton|neoplatón":[["Hipatia de Alejandría","maestra neoplatónica"],["Sosípatra","neoplatónica y teúrga"]],
 "epicur|epicúre":[["Leontion","la epicúrea del Jardín"]],
 "budis|budista|nirvana|karma":[["Kisa Gotami","el sufrimiento y la muerte"],["Machig Labdrön","el Chöd"],["Khema","la sabiduría"]],
 "confucian|confucio":[["Ban Zhao","educación y virtud"],["Im Yunjidang","la misma naturaleza en mujeres y hombres"]],
 "taois|taoís|dao":[["Xie Daoyun","el misterio y la naturaleza"]],
 "hindu|hindú|vedanta|upanishad|upanisad|yoga|atman":[["Gargi Vachaknavi","el fundamento del universo"],["Maitreyi","el Atman y la inmortalidad"],["Lal Ded","la no-dualidad"]],
 "sufi|sufí|sufismo":[["Rabia al-Adawiyya","el amor sin miedo ni recompensa"],["Fátima de Nishapur","mística sufí"]],
 "vitalis|vitalism":[["Anne Conway","un universo vivo"],["Hedwig Conrad-Martius","una ontología del ser vivo"]],
 "estructuralis|postestructural|posestructural":[["Julia Kristeva","lo semiótico y lo simbólico"],["Hélène Cixous","la escritura y la diferencia"]],
 "circulo de viena|círculo de viena|positivismo logico|positivismo lógico":[["Susan Stebbing","la lógica analítica en Gran Bretaña"],["Grete Hermann","fundamentos de la física cuántica"]],
 "feminismo de la diferencia|diferencia sexual":[["Luce Irigaray","la diferencia sexual"],["Luisa Muraro","el orden simbólico de la madre"],["Carla Lonzi","escupamos sobre Hegel"]],
 "feminismo ilustrado|feminismo de la igualdad":[["Celia Amorós","crítica de la razón patriarcal"],["Amelia Valcárcel","la herencia ilustrada del feminismo"]],
 "feminismo negro|black feminism|mujerismo":[["bell hooks","el feminismo es para todo el mundo"],["Patricia Hill Collins","el pensamiento feminista negro"]],
 "consecuencial|dilema del tranvia|dilema del tranvía|tranvia|tranvía":[["Philippa Foot","inventó el dilema del tranvía"],["Judith Jarvis Thomson","lo bautizó y lo complicó"]],
 "contrato social|contractual|contractualis":[["Carole Pateman","«El contrato sexual» oculto bajo el contrato social"]],
 "comunitaris|lo comun|lo común|comunidad":[["Raquel Gutiérrez Aguilar","lo comunitario-popular"],["Marina Garcés","un mundo común"]],
 "republican":[["Catharine Macaulay","historiadora republicana"],["Hannah Arendt","la libertad pública"]],
 "filosofia de la liberacion|filosofía de la liberación|latinoamerican":[["Ofelia Schutte","identidad cultural y liberación en América Latina"],["María Lugones","la colonialidad del género"]],
 "africana|africano|ubuntu|africa|áfrica":[["Sophie Oluwole","la filosofía yoruba"],["Tanella Boni","filosofía y poesía desde Costa de Marfil"],["Molara Ogundipe-Leslie","el feminismo africano"]],
 "china|chino|china antigua":[["Ban Zhao","la sabia de la dinastía Han"],["Li Xiaojiang","los estudios de la mujer en la China actual"]],
 "japon|japón|japones|japonés|zen":[["Sei Shōnagon","la sensibilidad de la corte Heian"],["Tadano Makuzu","«Pensamientos solitarios»"],["Hiratsuka Raichō","«en el principio la mujer era el sol»"]],
 "india|indio":[["Gargi Vachaknavi","las Upanishads"],["Savitribai Phule","educación contra la casta"]],
 "dualis|mente y cuerpo|mente-cuerpo|cuerpo y mente|cuerpo y alma":[["Isabel de Bohemia","le preguntó a Descartes cómo mueve el alma al cuerpo"],["Anne Conway","contra el dualismo: espíritu y materia en continuidad"]],
 "determinis|libre albedrio|libre albedrío|libertad de la voluntad":[["Elizabeth Anscombe","«Causality and Determination»: la causalidad sin determinismo"]],
 "causalidad|causa|causas":[["Mary Shepherd","nada empieza a existir sin causa"],["Elizabeth Anscombe","«Causality and Determination»"]],
 "sustancia":[["Anne Conway","una sola sustancia viva"],["Margaret Cavendish","la materia que piensa"]],
 "inmortal|resurrecci":[["Maitreyi","pregunta por la inmortalidad"],["Macrina la Joven","el alma y la resurrección"]],
 "sublime":[["Bonnie Mann","lo sublime repensado desde el feminismo"]],
 "significado|semantic|semántic":[["Victoria Welby","una teoría del significado"],["Ruth Millikan","el significado como función biológica"]],
 "sujeto|subjetividad|el yo|yo":[["Judith Butler","cómo el poder nos hace sujetos"],["Mary Whiton Calkins","la psicología del yo"]],
 "percepcion|percepción|sentidos|sensacion|sensación":[["Vernon Lee","sentir las formas con el cuerpo"],["Carolyn Korsmeyer","el gusto, un sentido filosófico"]],
 "imaginacion|imaginación|imaginario":[["Michèle Le Dœuff","el imaginario de la filosofía"],["María Zambrano","la razón poética"]],
 "progreso":[["Sophie de Grouchy","la Ilustración de la simpatía y el progreso moral"]],
 "propiedad|cercamiento|acumulacion|acumulación":[["Silvia Federici","los cercamientos y la acumulación originaria"]],
 "ideolog":[["Hannah Arendt","«Ideología y terror»"]],
 "alienac|alienación|enajenac":[["Rahel Jaeggi","la alienación como relación sin relación"]],
 "metodo|método|metodolog":[["Sandra Harding","el método, desde la epistemología feminista"],["Linda Tuhiwai Smith","descolonizar las metodologías"]],
 "induccion|inducción":[["Dorothy Wrinch","el principio de inducción"]],
 "paradoja":[["Cleobulina de Rodas","enigmas y paradojas"],["Sulabha","la paradoja contra un rey"]],
 "teolog":[["Mary Daly","teología feminista radical"],["Rosemary Radford Ruether","teología ecofeminista"]],
 "cosmolog|cosmogon":[["Hipatia de Alejandría","astronomía y cosmos"],["Hildegarda de Bingen","un cosmos vivo"]],
 "tragedia|tragic|trágic":[["Martha Nussbaum","«La fragilidad del bien»: la tragedia griega y la ética"]],
 "mito|mitos|mitolog":[["Adriana Cavarero","relee los mitos griegos desde las mujeres"],["Enheduana","himnos a Inanna"]],
 "dialogo|diálogo|conversac":[["Madeleine de Scudéry","la conversación como forma de pensar"],["Diotima de Mantinea","el diálogo del Banquete"]],
 "biopolit|biopoder|vida precaria|precaridad":[["Judith Butler","vidas precarias"]],
 "poscolonial|postcolonial|subaltern":[["Gayatri Spivak","¿puede hablar el subalterno?"],["Chandra T. Mohanty","«Bajo los ojos de Occidente»"]],
 "logica modal|lógica modal|necesidad":[["Ruth Barcan Marcus","la lógica modal cuantificada"]],
 "filosofia de la ciencia|filosofía de la ciencia|epistemologia|epistemología":[["Sandra Harding","quién conoce y desde dónde"],["Helen Longino","la ciencia como conocimiento social"]],
 "filosofia de la mente|filosofía de la mente":[["Patricia Churchland","neurofilosofía"],["Ruth Millikan","teleosemántica"]],
 "filosofia del lenguaje|filosofía del lenguaje":[["Rae Langton","actos de habla"],["Victoria Welby","el significado"]],
 "filosofia politica|filosofía política":[["Hannah Arendt","la acción entre iguales"],["Iris Marion Young","la justicia y la diferencia"]]
};
const CONK=Object.entries(CONCEPTOS).map(([k,v])=>({roots:k.split('|').map(norm),list:v}));
/* ¿lo buscado es un concepto del diccionario? */
function concepto(q){
  const words=q.split(/[\s,.;:¿?¡!«»"']+/).filter(Boolean);
  let best=null;
  for(const c of CONK){
    let sc=0;
    for(const r of c.roots){
      if(r.includes(' ')){ if(q.includes(r)) sc=Math.max(sc,4+r.length/100); continue; }
      for(const w of words){
        if(r.endsWith('$')){ if(w===r.slice(0,-1)) sc=Math.max(sc,3+r.length/100); continue; }
        if(w===r) sc=Math.max(sc,3+r.length/100);
        else if(r.length>=3&&w.startsWith(r)) sc=Math.max(sc,2+r.length/100);
        else if(w.length>=5&&r.length>=5&&lev(w,r)<=1) sc=Math.max(sc,1);
      }
    }
    if(sc&&(!best||sc>best.sc))best={c,sc};
  }
  if(!best)return null;
  const list=best.c.list.map(([n,m])=>({p:P.find(x=>x.n===n),m})).filter(o=>o.p);
  return list.length?{list,sc:best.sc}:null;
}
/* si no está en el diccionario: la filósofa cuya ficha mejor encaja con lo buscado */
function porFicha(q){
  const words=q.split(/\s+/).filter(w=>w.length>=3);
  if(!words.length)return null;
  const sc=P.map(p=>{
    const s=norm(p.s), tr=norm(p.tr), pl=norm(p.pl), tg=p.tags.map(t=>norm(TAGS[t][0]));
    let v=0;
    for(const w of words){
      if(tg[0].startsWith(w))v+=4; else if(tg.some(t=>t.startsWith(w)))v+=3;
      if(s.includes(w))v+=2.5; if(tr.includes(w))v+=2; if(pl.includes(w))v+=1;
    }
    return {p,v:v?v+p.w*.4:0};
  }).filter(o=>o.v>0).sort((a,b)=>b.v-a.v).slice(0,3);
  return sc.length?{list:sc.map(o=>({p:o.p,m:o.p.s.replace(/\.$/,'')}))}:null;
}

/* en la ficha, solo si llegas desde una búsqueda: por qué te la recomendamos */
function homLine(p){
  const esc=t=>t.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  if(homNow){const o=homNow.list.find(o=>o.p===p); if(o)return homNow.kind==='hom'?`<p class="homl">Sobre lo mismo que <b>${esc(homNow.name)}</b>: ${esc(o.m)}.</p>`:`<p class="homl">Para «<b>${esc(homNow.name)}</b>»: ${esc(o.m)}.</p>`;}
  return '';
}
let hits=[], homNow=null;
function filter(){
  const q=norm(query.trim()); let c=0; hits=[];
  /* si no coincide con ninguna filósofa pero sí con un filósofo, mostramos sus homólogas */
  homNow=null;
  /* buscas a una filósofa por su nombre exacto → no recomendamos nada; si no: filósofo → homóloga; idea → filósofa */
  const exacta=q&&P.some(p=>{const n=norm(p.n);return n===q||n.split(/[\s-]+/).includes(q)||(q.includes(' ')&&n.includes(q))});
  if(q&&!exacta){
    const h=homologa(q), c=concepto(q), parcial=P.some(p=>nameScore(p,q)>=2);
    /* una idea escrita tal cual gana a un filósofo que solo se le parece (sueño ≠ Bueno) */
    if(h&&h.list.length&&!parcial&&!(h.sc<3&&c&&c.sc>=3))homNow={...h,kind:'hom'};
    else if(c&&(c.sc>=3||!parcial))homNow={...c,kind:'con',name:query.trim()};
    else if(!parcial){const f=porFicha(q); if(f)homNow={...f,kind:'con',name:query.trim()};}
  }
  const homSet=new Map((homNow?homNow.list:[]).map((o,k)=>[o.p,3.6-k*.01]));
  P.forEach(p=>{
    const hay=norm([p.n,p.pl,p.tr,p.s,p.era.n,CONTS[p.c],p.tags.map(t=>TAGS[t][0]).join(' ')].join(' '));
    const ns=Math.max(q?nameScore(p,q):0,homSet.get(p)||0);
    const ok=(!q||ns>0||hay.includes(q))&&(!activeTag||p.tags.includes(activeTag))&&(activeCont===null||p.c===activeCont)&&(activeEra===null||p.era.k===activeEra);
    p.el.classList.toggle('off',!ok); p.el.classList.toggle('hit',!!(q&&ok&&ns));
    if(ok){c++; if(q)hits.push({p,s:ns})}
  });
  hits.sort((a,b)=>b.s-a.s||b.p.w-a.p.w);
  const hb=document.getElementById('hom');
  if(homNow){
    hb.innerHTML=homNow.kind==='hom'?'¿Buscas a <b></b>? Sobre lo mismo, desde su lugar: ':'Para «<b></b>», te recomendamos a ';
    hb.querySelector('b').textContent=homNow.name;
    homNow.list.forEach((o,k)=>{const b=document.createElement('button');b.className='hitb';b.textContent=o.p.n;b.style.setProperty('--ec',o.p.h);
      b.onclick=e=>{e.stopPropagation();if(sel&&sel!==o.p)recordar();select(o.p);goTo(o.p)};
      if(k===1)hb.append(homNow.kind==='hom'?' · ':'. También: '); else if(k)hb.append(' · ');
      hb.append(b,' — '+o.m)});
    hb.hidden=false;
  } else hb.hidden=true;
  const cnt=document.getElementById('count');
  cnt.textContent=(q||activeTag||activeCont!==null||activeEra!==null)?`${c} de ${P.length} filósofas`:`${P.length} filósofas`;
  if(q){
    if(!c){ cnt.textContent='Todavía no tenemos «'+query.trim()+'» en el buscador. ';
      const a=document.createElement('a'); a.href='sugerir.html?filosofa='+encodeURIComponent(query.trim()); a.textContent='¿Quieres añadirlo?'; cnt.append(a); }
    else { cnt.append(': ');
      hits.slice(0,12).forEach((h,k)=>{const b=document.createElement('button');b.className='hitb';b.textContent=h.p.n;
        b.style.setProperty('--ec',h.p.h);b.onclick=e=>{e.stopPropagation();if(sel&&sel!==h.p)recordar();select(h.p);goTo(h.p)};
        if(k)cnt.append(' · '); cnt.append(b)});
      if(hits.length>12)cnt.append(' …'); }
  }
  document.querySelectorAll('#chips .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===activeTag));
  document.querySelectorAll('#conts .chip').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.c===activeCont));
  document.querySelectorAll('#legend button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.k===activeEra));
  /* lo elegido se ve en el botón del desplegable */
  const pon=(id,txt)=>{const v=document.getElementById('v-'+id),d=document.getElementById('dd-'+id);d.classList.toggle('activo',!!txt);
    if(txt)v.textContent=': '+txt;else v.innerHTML=id==='epocas'?SYMS_HTML:''};
  pon('epocas',activeEra!==null?ERAS[activeEra].n:'');
  if(activeEra!==null){const e=ERAS[activeEra];document.getElementById('v-epocas').innerHTML=`: <span class="sym" style="--ec:${e.h}" aria-hidden="true">${e.sym}</span>${e.n}`}
  pon('ideas',activeTag?TAGS[activeTag][0]:'');
  pon('conts',activeCont!==null?CONTS[activeCont]:'');
  document.getElementById('limpiar').hidden=!(activeTag||activeCont!==null||activeEra!==null);
  P.forEach(p=>{if(p.li)p.li.hidden=p.el.classList.contains('off')});
  document.querySelectorAll('#lista section').forEach(sc=>sc.hidden=!sc.querySelector('li:not([hidden])'));
}
function setTag(t){activeTag=activeTag===t?null:t;filter()}
let activeCont=null;
function setCont(c){activeCont=activeCont===c?null:c;filter()}

const conts=document.getElementById('conts');
CONTS.forEach((n,c)=>{
  const b=document.createElement('button');b.className='chip';b.dataset.c=c;b.textContent=n+' ('+P.filter(p=>p.c===c).length+')';
  b.setAttribute('aria-pressed','false');b.onclick=()=>setCont(c);conts.appendChild(b);
});
const chips=document.getElementById('chips');
Object.entries(TAGS).forEach(([k,v])=>{
  const b=document.createElement('button');b.className='chip';b.dataset.t=k;b.textContent=v[0];
  b.setAttribute('aria-pressed','false');b.onclick=()=>setTag(k);chips.appendChild(b);
});
let activeEra=null;
const legend=document.getElementById('legend');
legend.innerHTML=ERAS.map(e=>`<button type="button" aria-pressed="false" data-k="${e.k}" style="--ec:${e.h}"><span class="sym" aria-hidden="true">${e.sym}</span>${e.n}</button>`).join('');
legend.querySelectorAll('button').forEach(b=>b.onclick=()=>{const k=+b.dataset.k;activeEra=activeEra===k?null:k;filter()});
/* ---------- desplegables de filtros ---------- */
/* los símbolos de las épocas, cada uno con el color de su época */
const SYMS_HTML='<span class="syms" aria-hidden="true">'+ERAS.map(e=>`<span class="sym" style="--ec:${e.h}">${e.sym}</span>`).join('')+'</span>';
document.getElementById('v-epocas').innerHTML=SYMS_HTML;
const DDS=[...document.querySelectorAll('#filtros details')];
function cerrarDD(salvo){DDS.forEach(d=>{if(d!==salvo)d.open=false})}
DDS.forEach(d=>d.addEventListener('toggle',()=>{if(d.open)cerrarDD(d)}));
document.addEventListener('click',e=>{if(!e.target.closest('#filtros'))cerrarDD()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=DDS.find(d=>d.open);if(o){o.open=false;o.querySelector('summary').focus()}}});
/* al elegir un filtro, se cierra el desplegable */
['legend','chips','conts'].forEach(id=>document.getElementById(id).addEventListener('click',e=>{if(e.target.closest('button'))setTimeout(cerrarDD,120)}));
document.getElementById('limpiar').onclick=()=>{activeTag=null;activeCont=null;activeEra=null;filter()};
/* ideas del buscador, por grupos: cada una abre su entrada */
const IDEAS_GRUPOS={
 'Grandes preguntas':['amor','muerte','libertad','justicia','felicidad','verdad','belleza','el mal','dios','el tiempo','la identidad','el sentido de la vida','nihilismo'],
 'Disciplinas':['lógica','metafísica','epistemología','ética','estética','filosofía política','filosofía del lenguaje','filosofía de la mente','filosofía de la ciencia','bioética','derecho','teología','educación'],
 'Épocas de la historia':['presocráticos','filosofía antigua','helenismo','patrística','escolástica','Edad Media','Renacimiento','modernidad','Ilustración','romanticismo','filosofía analítica','filosofía continental','posmodernidad'],
 'Escuelas y corrientes':['pitagorismo','sofística','platonismo','aristotelismo','estoicismo','epicureísmo','neoplatonismo','racionalismo','empirismo','idealismo','materialismo','marxismo','anarquismo','pragmatismo','fenomenología','existencialismo','hermenéutica','estructuralismo','teoría crítica','deconstrucción'],
 'Feminismos':['feminismo ilustrado','feminismo de la diferencia','feminismo negro','interseccionalidad','ecofeminismo','teoría queer','ética del cuidado','feminismo decolonial'],
 'Tradiciones del mundo':['budismo','confucianismo','taoísmo','vedanta','sufismo','filosofía africana','filosofía japonesa','filosofía latinoamericana','pensamiento indígena','colonialismo'],
 'Problemas clásicos':['mente y cuerpo','determinismo','causalidad','sustancia','inmortalidad','lo sublime','el sujeto','la imaginación','la alienación','el contrato social','la paradoja','dilema del tranvía'],
 'El cuerpo':['cuerpo','pelo','manos','brazo','piel','boca','pechos','vagina','pene','útero','regla','corazón','cerebro'],
 'Vida cotidiana':['trabajo','cuidados','maternidad','cuerpo','comida','casa','ciudad','dinero','tecnología','inteligencia artificial','naturaleza','animales','ansiedad','soledad','vejez','ira','miedo'],
 'Tiempo libre':['deporte','juego','baile','música','cine','viajes','humor','moda','paisaje','amistad','sexo','sueño'],
 'Día a día':['móvil','redes sociales','cansancio','alquiler','deuda','sueldo','compras','basura','reparar','jardín','mascotas','cartas'],
 'Cosas':['cosas','flor','mesa','espejo','ropa','zapatillas','mar','luna','basura','casa','dinero','máquina'],
 'Amor, cuerpo y familia':['boda','poliamor','celos','ligar','embarazo','regla','lactancia','hijos','adolescencia','juguetes','abuelos','sororidad','acoso']
};
document.getElementById('ideas-grupos').innerHTML=Object.entries(IDEAS_GRUPOS).map(([g,l])=>`<h4>${g} <span class="dd-h">(abren su filósofa)</span></h4><div class="ideas-l">${l.map(t=>`<button type="button" data-q="${t}">${t}</button>`).join('')}</div>`).join('');
document.querySelectorAll('#ideas-grupos button').forEach(b=>b.onclick=()=>{cerrarDD();explorar(b.dataset.q)});
/* controles del zoom */
document.getElementById('zmas').onclick=()=>aplicarZoom(ZM*1.25);
document.getElementById('zmenos').onclick=()=>aplicarZoom(ZM/1.25);
document.getElementById('ztodo').onclick=()=>{const b=document.getElementById('ztodo');
  if(ZM<.99){aplicarZoom(1);b.textContent='Ver todo'}else{aplicarZoom(Math.min(1,(frame.clientWidth-4)/MW),0,0);frame.scrollLeft=0;b.textContent='Tamaño normal'}};
/* Ctrl + rueda (o pellizco en el panel táctil) acerca y aleja sobre el punto del ratón */
frame.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();const r=frame.getBoundingClientRect();aplicarZoom(ZM*(e.deltaY<0?1.12:1/1.12),e.clientX-r.left,e.clientY-r.top)},{passive:false});
/* pellizco con dos dedos en el móvil: acerca y aleja sobre el punto entre los dedos; un dedo sigue desplazando */
(()=>{let d0=0,z0=1,raf=0,ult=null;
  const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
  const medio=t=>{const r=frame.getBoundingClientRect();return [(t[0].clientX+t[1].clientX)/2-r.left,(t[0].clientY+t[1].clientY)/2-r.top]};
  frame.addEventListener('touchstart',e=>{if(e.touches.length===2){d0=dist(e.touches);z0=ZM}},{passive:true});
  frame.addEventListener('touchmove',e=>{
    if(e.touches.length!==2||!d0)return;
    e.preventDefault();
    ult=[z0*dist(e.touches)/d0,...medio(e.touches)];
    if(!raf)raf=requestAnimationFrame(()=>{raf=0;if(ult)aplicarZoom(ult[0],ult[1],ult[2])});
  },{passive:false});
  frame.addEventListener('touchend',e=>{if(e.touches.length<2)d0=0},{passive:true});
})();
let qt;
const qi=document.getElementById('q');
qi.addEventListener('input',e=>{query=e.target.value;hist=[];filter();
  clearTimeout(qt);if(movimientoReducido())return; /* con movimiento reducido no saltamos solos: se usa Intro o se toca el nombre */
  qt=setTimeout(()=>{const nm=hits.filter(h=>h.s>0);
    if(nm.length===1||homNow)select(nm[0].p); if(nm.length){goTo(nm[0].p)} },500)});
qi.addEventListener('keydown',e=>{if(e.key==='Enter'&&hits.length){clearTimeout(qt);select(hits[0].p);goTo(hits[0].p);qi.blur()}});
function buildList(){
  const L=document.getElementById('lista');
  L.innerHTML=ERAS.map(e=>`<section style="--ec:${e.h}" aria-labelledby="era-${e.k}"><h2 id="era-${e.k}"><span class="sym" aria-hidden="true">${e.sym}</span>${e.n}</h2><ul></ul></section>`).join('');
  const uls=L.querySelectorAll('ul');
  [...P].sort((a,b)=>a.rank-b.rank).forEach(p=>{
    const li=document.createElement('li'), b=document.createElement('button');
    b.type='button';b.style.setProperty('--ec',p.h);
    b.innerHTML='<span class="nm"></span><small></small>';
    b.querySelector('.nm').textContent=p.n;b.querySelector('small').textContent=datesOf(p)+' · '+p.pl;
    b.onclick=e=>{e.stopPropagation();select(p)};
    li.appendChild(b);uls[p.era.k].appendChild(li);p.li=li;
  });
}
function setMode(m){mode=m;
  document.getElementById('mList').setAttribute('aria-pressed',m==='lista');
  const isL=m==='lista'; frame.hidden=isL; document.getElementById('lista').hidden=!isL;
  if(isL){if(!P[0].li)buildList();filter();
    ['mIdeas','mTime','mWorld'].forEach(id=>document.getElementById(id).setAttribute('aria-pressed','false'));return}
  document.getElementById('mIdeas').setAttribute('aria-pressed',m==='ideas');
  document.getElementById('mTime').setAttribute('aria-pressed',m==='time');
  document.getElementById('mWorld').setAttribute('aria-pressed',m==='world');
  layout(); if(sel)goTo(sel); else frame.scrollTo({left:m!=='ideas'?0:(escala.offsetWidth-frame.clientWidth)/2});
}
document.getElementById('mIdeas').onclick=()=>setMode('ideas');
document.getElementById('mTime').onclick=()=>setMode('time');
document.getElementById('mWorld').onclick=()=>setMode('world');
document.getElementById('mList').onclick=()=>setMode('lista');
/* al cambiar los ajustes de lectura, recolocamos el mapa (cambian los tamaños de los nombres) */
document.addEventListener('ajustes',()=>{(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{if(mode!=='lista')layout()})});
document.addEventListener('click',e=>{if(sel&&!quizOpen&&e.target.isConnected&&!card.contains(e.target)&&!e.target.classList.contains('n')&&!e.target.closest('#quiz,#aj,#lista,#filtros,.zoom'))select(null)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('#aj.open')){if(quizOpen)closeQuiz();else select(null)}});
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(mode!=='lista')layout()},200)});

/* ---------- compartir ---------- */
const BASE=location.origin+location.pathname;
const linkTo=p=>BASE+'#'+encodeURIComponent(p.n);
function setHash(h){try{history.replaceState(null,'',h||location.pathname+location.search)}catch(e){}}
function toast(t){const el=document.getElementById('toast');el.textContent=t;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('on'),2200)}
/* si el navegador no deja copiar, un cuadro propio con el texto ya seleccionado */
function cuadroCopiar(t){
  let c=document.getElementById('copiar');
  if(!c){c=document.createElement('div');c.id='copiar';c.setAttribute('role','dialog');c.setAttribute('aria-label','Copiar enlace');
    c.innerHTML='<p>Copia este texto para compartirlo:</p><textarea readonly rows="3"></textarea><div><button type="button" class="main" data-c>Copiar</button><button type="button" data-x>Cerrar</button></div>';
    document.body.appendChild(c);
    c.querySelector('[data-x]').onclick=()=>c.hidden=true;
    c.querySelector('[data-c]').onclick=()=>{const ta=c.querySelector('textarea');ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}
      if(ok){c.hidden=true;toast('Copiado')}else toast('Mantén pulsado el texto para copiarlo')};
    c.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();c.hidden=true}});}
  c.hidden=false;const ta=c.querySelector('textarea');ta.value=t;ta.focus();ta.select();
}
async function copy(t,msg='Enlace copiado'){
  try{await navigator.clipboard.writeText(t);toast(msg)}
  catch(e){cuadroCopiar(t)}
}
async function share(d){
  if(navigator.share){try{await navigator.share(d);return}catch(e){if(e.name==='AbortError')return}}
  copy(d.text?d.text+' '+d.url:d.url, d.text?'Resultado copiado: pégalo donde quieras':'Enlace copiado');
}

/* ---------- test: ¿Qué filósofa eres? ---------- */
const QS=[
 {q:"Tienes un domingo entero para ti. ¿Qué haces?",o:[
  ["Me pierdo en un problema de lógica o de matemáticas",{logica:2,ciencia:1}],
  ["Voy a una manifestación o a una asamblea",{politica:2,feminismo:1}],
  ["Silencio, paseo largo, quizá meditar",{mistica:2,existencia:1}],
  ["Museo, poesía o escribir en mi cuaderno",{estetica:2,lenguaje:1}]]},
 {q:"¿Qué te enfada más?",o:[
  ["Un argumento mal construido",{logica:1,conocimiento:2}],
  ["Una injusticia que todo el mundo ve normal",{politica:1,raza:1,decolonial:1}],
  ["Que se destruya la naturaleza",{ecologia:2,cuerpo:1}],
  ["Que nadie valore a quien cuida",{cuidado:2,feminismo:1}]]},
 {q:"La pregunta que no te deja dormir:",o:[
  ["¿Qué es realmente real?",{metafisica:2,mistica:1}],
  ["¿Cómo sabemos lo que creemos saber?",{conocimiento:2,ciencia:1}],
  ["¿Cómo hay que vivir?",{etica:2,existencia:1}],
  ["¿Quién manda, y por qué?",{politica:2,economia:1}]]},
 {q:"Tu herramienta favorita para pensar:",o:[
  ["Las fórmulas y los datos",{ciencia:2,logica:1}],
  ["El cuerpo: lo que siento y lo que me pasa",{cuerpo:2,existencia:1}],
  ["Las palabras y lo que callan",{lenguaje:2,psique:1}],
  ["La conversación con otras",{politica:1,cuidado:1,educacion:1}]]},
 {q:"Si pudieras fundar algo, sería…",o:[
  ["Una escuela",{educacion:2,cuidado:1}],
  ["Un laboratorio",{ciencia:2,mente:1}],
  ["Una comunidad retirada del mundo",{mistica:2,etica:1}],
  ["Un colectivo feminista",{feminismo:2,politica:1}]]},
 {q:"El deseo, los sueños, el inconsciente…",o:[
  ["Me fascinan: ahí está todo",{psique:2,cuerpo:1}],
  ["Prefiero lo que se puede demostrar",{logica:1,mente:2}],
  ["El deseo también es político",{feminismo:1,cuerpo:1,politica:1}],
  ["Hay que ir más allá del deseo",{mistica:2,etica:1}]]},
 {q:"¿Desde dónde miras el mundo?",o:[
  ["Desde mi tierra y mis raíces, contra lo colonial",{decolonial:2,raza:1}],
  ["Desde quién trabaja y quién se queda con el dinero",{economia:2,politica:1}],
  ["Desde la Tierra: somos naturaleza",{ecologia:2,metafisica:1}],
  ["Desde dentro de la mente",{mente:2,lenguaje:1}]]},
 {q:"¿En qué época te sentirías en casa?",o:[
  ["En la Grecia o la India antiguas",{_era:[-9999,500]}],
  ["Entre monasterios, beguinas y místicas",{_era:[500,1700]}],
  ["En los salones de la Ilustración y el siglo XIX",{_era:[1700,1880]}],
  ["En el siglo XX o ahora mismo",{_era:[1880,9999]}]]}
];
let quizOpen=false, qn=0, qsc={}, qera=null;
const qbox=document.getElementById('qbox'), qwrap=document.getElementById('quiz');
function openQuiz(){quizOpen=true;qn=0;qsc={};qera=null;select(null);qwrap.classList.add('open');setHash('#test');renderQ()}
function closeQuiz(){quizOpen=false;qwrap.classList.remove('open');if(!sel)setHash('')}
qwrap.addEventListener('click',e=>{if(e.target===qwrap)closeQuiz()});
document.getElementById('quizbtn').onclick=e=>{e.stopPropagation();openQuiz()};
function renderQ(){
  const Q=QS[qn];
  qbox.innerHTML=`<button class="x" aria-label="Cerrar">×</button>
   <div class="step">Pregunta ${qn+1} de ${QS.length}</div><div class="bar2"><i style="width:${qn/QS.length*100}%"></i></div>
   <h2>${Q.q}</h2><div class="opts">${Q.o.map((o,k)=>`<button data-k="${k}">${o[0]}</button>`).join('')}</div>`;
  qbox.querySelector('.x').onclick=closeQuiz;
  qbox.querySelectorAll('.opts button').forEach(b=>b.onclick=()=>{
    const w=Q.o[+b.dataset.k][1];
    for(const k in w){ if(k==='_era')qera=w[k]; else qsc[k]=(qsc[k]||0)+w[k]; }
    qn++; qn<QS.length?renderQ():result();
  });
  qbox.querySelector('.opts button').focus({preventScroll:true});
}
function rank(){
  return P.map(p=>{
    let s=0; p.tags.forEach((t,k)=>s+=(qsc[t]||0)*(k===0?1.5:1));
    s/=Math.sqrt(p.tags.length+.5);
    if(qera&&p.b>=qera[0]&&p.b<qera[1])s+=2.2;
    s+=hash(p.n+JSON.stringify(qsc))*.4;   /* desempate */
    return {p,s};
  }).sort((a,b)=>b.s-a.s);
}
function result(){
  const r=rank(), p=r[0].p, also=r.slice(1,4).map(o=>o.p);
  const top=Object.entries(qsc).sort((a,b)=>b[1]-a[1]).map(([t])=>t);
  const shared=top.filter(t=>p.tags.includes(t)).slice(0,3).map(t=>TAGS[t][0]);
  qbox.style.setProperty('--ec',p.h);
  const dates=datesOf(p);
  qbox.innerHTML=`<button class="x" aria-label="Cerrar">×</button>
   <div class="res"><div class="cab">${cara(p)}<div><div class="pre">Tu filósofa es…</div><h2>${nombre(p)}</h2>
   <div class="why">${dates} · ${p.pl} · ${p.tr}</div></div></div>
   <p>${p.s}</p>
   ${shared.length?`<div class="why">Compartís: ${shared.join(', ')}.</div>`:''}
   <div class="share"><button class="main" id="qsh">Compartir resultado</button><button id="qmap">Verla en el mapa</button><button id="qre">Repetir</button></div>
   <div class="also">También te pareces a: ${also.map(q=>`<button data-i="${q.i}" style="--ec:${q.h}">${q.n}</button>`).join(' · ')}</div>
   ${window.CAFE_URL?`<p class="apoyo" style="margin-top:16px">¿Te ha gustado? <a class="cafe" href="${window.CAFE_URL}" target="_blank" rel="noopener">☕ Invítame a un café</a></p>`:''}</div>`;
  qbox.querySelector('.x').onclick=closeQuiz;
  const text=`Me ha salido ${p.n} en «¿Qué filósofa eres?». ¿Y a ti?`;
  qbox.querySelector('#qsh').onclick=()=>share({title:'¿Qué filósofa eres?',text,url:BASE+'#test'});
  qbox.querySelector('#qmap').onclick=()=>{closeQuiz();select(p);goTo(p)};
  qbox.querySelector('#qre').onclick=openQuiz;
  qbox.querySelectorAll('.also button').forEach(b=>b.onclick=()=>{const q=P[+b.dataset.i];closeQuiz();select(q);goTo(q)});
}

filter();
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{layout();
  frame.scrollLeft=(escala.offsetWidth-frame.clientWidth)/2;
  fromHash();
});
function fromHash(){
  let h='';try{h=decodeURIComponent(location.hash.slice(1))}catch(e){return}
  if(h==='test'){openQuiz();return}
  const p=P.find(q=>q.n===h); if(p&&p!==sel){select(p);goTo(p)}
}
addEventListener('hashchange',fromHash);
