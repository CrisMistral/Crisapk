/* ─── BIBLIOTECA DE EJERCICIOS (calistenia en esterilla: sin pared ni muebles) ───
   a: animación · e: emoji · n: nombre · d: cómo se hace · v: frase de la voz · tip: consejo/adaptación */
const EX={
 /* Calentamiento */
 march:{a:'march',e:'🚶',n:'Marcha en el sitio',d:'De pie, sube una rodilla y luego la otra, balanceando los brazos. Ritmo cómodo.',v:'Rodillas arriba, brazos sueltos. Despierta el cuerpo.',tip:'Si quieres más, sube las rodillas hasta la cadera.'},
 armcircle:{a:'armcircle',e:'🔄',n:'Círculos de brazos',d:'De pie, dibuja círculos grandes con los brazos estirados, hacia atrás.',v:'Círculos grandes y lentos. Suelta los hombros.',tip:'A mitad, cambia el sentido de los círculos.'},
 hipcircle:{a:'hipcircle',e:'⭕',n:'Círculos de cadera',d:'Manos en la cintura, rodillas sueltas. Dibuja círculos amplios con la cadera.',v:'Círculos amplios con la cadera, sin prisa.',tip:'A mitad, cambia de sentido.'},
 catcow:{a:'catcow',e:'🐈',n:'Gato y vaca',d:'A cuatro patas. Al inhalar hunde la espalda y mira al frente; al exhalar redondéala como un gato.',v:'Inhala, abre el pecho. Exhala, redondea la espalda.',tip:'Muévete con la respiración, sin forzar.'},
 /* Piernas y glúteos */
 squat_half:{a:'squat_half',e:'🪑',n:'Media sentadilla',d:'Pies al ancho de caderas. Baja la cadera hacia atrás como para sentarte, solo hasta media altura, y sube.',v:'Cadera atrás, pecho alto. Baja y sube.',tip:'Las rodillas siguen la dirección de los pies. Peso en los talones.'},
 squat:{a:'squat',e:'🦵',n:'Sentadilla',d:'Pies al ancho de caderas. Baja la cadera hacia atrás hasta que los muslos queden casi paralelos al suelo y sube empujando el suelo.',v:'Baja controlada, sube empujando el suelo.',tip:'Espalda larga y talones pegados al suelo. Brazos al frente para equilibrarte.'},
 jumpsquat:{a:'jumpsquat',e:'🚀',n:'Sentadilla con salto',d:'Haz una sentadilla y, al subir, da un salto suave. Aterriza con las rodillas blandas y enlaza la siguiente.',v:'Baja, salta y aterriza suave.',tip:'Si no puedes saltar (vecinos, rodillas), haz sentadillas con 3 segundos de pausa abajo.'},
 lunge_short:{a:'lunge_short',e:'👣',n:'Zancada corta atrás',d:'De pie, da un paso corto hacia atrás y dobla un poco las dos rodillas. Vuelve y cambia de pierna.',v:'Paso atrás, baja un poco, vuelve. Alterna.',tip:'Mantén el peso en la pierna de delante. Hazlo despacio para no perder el equilibrio.'},
 lunge:{a:'lunge',e:'🦿',n:'Zancada atrás',d:'Da un paso largo hacia atrás y baja la rodilla de atrás cerca del suelo. Vuelve empujando con la pierna de delante. Alterna.',v:'Paso atrás, rodilla abajo, vuelve. Alterna piernas.',tip:'La rodilla de delante queda encima del tobillo. Tronco recto.'},
 lunge_knee:{a:'lunge_knee',e:'⚡',n:'Zancada con rodilla arriba',d:'Zancada atrás y, al volver, sube esa rodilla hasta la cadera. Alterna piernas.',v:'Zancada atrás y rodilla arriba. Con control.',tip:'Si te desequilibras, apoya el pie un momento antes de subir la rodilla.'},
 sumo:{a:'sumo',e:'🏯',n:'Sentadilla sumo',d:'Pies más abiertos que la cadera y puntas hacia fuera. Baja con el tronco recto y sube apretando los glúteos.',v:'Pies abiertos, rodillas hacia fuera. Baja y sube.',tip:'Las rodillas apuntan hacia donde miran los pies.'},
 sumo_pulse:{a:'sumo',e:'🏯',n:'Sentadilla sumo con rebotes',d:'Postura sumo. Baja y haz dos pequeños rebotes abajo antes de subir.',v:'Baja, dos rebotes cortos y sube.',tip:'Rebotes pequeños y controlados, sin dejarte caer.'},
 sumohold:{a:'sumohold',e:'🧱',n:'Sumo mantenida',d:'Baja a la postura sumo y quédate ahí, tronco recto y rodillas hacia fuera.',v:'Aguanta abajo. Respira.',tip:'Si quema demasiado, sube un poco y sigue aguantando.'},
 calfraise:{a:'calfraise',e:'🦶',n:'Elevación de talones',d:'De pie, sube a la punta de los pies despacio y baja sin apoyar del todo los talones.',v:'Arriba de puntillas, abajo despacio.',tip:'Mira un punto fijo delante para mantener el equilibrio.'},
 calfraise_slow:{a:'calfraise',e:'🦶',n:'Talones lentos con pausa',d:'Sube de puntillas, aguanta 2 segundos arriba y baja en 3 segundos.',v:'Sube, aguanta, baja lento.',tip:'Cuanto más lento, más trabajan los gemelos.'},
 squathold:{a:'squathold',e:'🧘',n:'Sentadilla isométrica',d:'Baja a sentadilla y quédate quieta, como sentada en una silla invisible.',v:'Aguanta abajo. Respira tranquila.',tip:'Nivel fácil: quédate a media altura.'},
 bridge:{a:'bridge',e:'🌉',n:'Puente de glúteo',d:'Boca arriba, rodillas dobladas y pies en el suelo. Sube la cadera apretando los glúteos y baja despacio.',v:'Sube la cadera, aprieta los glúteos, baja lento.',tip:'Empuja con los talones. No arquees la zona lumbar.'},
 bridgehold:{a:'bridgehold',e:'🌉',n:'Puente mantenido',d:'Sube la cadera al puente y mantenla arriba, glúteos apretados.',v:'Cadera arriba y aguanta. Respira.',tip:'Si notas la lumbar, baja un poco la cadera.'},
 bridge1leg:{a:'bridge1leg',e:'🦩',n:'Puente a una pierna',d:'Puente con una pierna estirada hacia arriba. Sube y baja la cadera. A mitad de tiempo, cambia de pierna.',v:'Una pierna arriba, sube la cadera. Cambia a mitad.',tip:'La cadera sube recta, sin torcerse hacia un lado.'},
 bridgemarch:{a:'bridgemarch',e:'🥁',n:'Puente con marcha',d:'En el puente, sube una rodilla hacia el pecho y luego la otra, sin que baje la cadera.',v:'Cadera arriba, marcha lenta.',tip:'Si la cadera baja, haz el puente normal.'},
 /* Pecho, hombros y brazos */
 pushup_knee:{a:'pushup_knee',e:'💪',n:'Flexión con rodillas',d:'Rodillas en la esterilla y manos bajo los hombros. Baja el pecho hacia el suelo y sube, cuerpo recto de rodillas a cabeza.',v:'Baja el pecho, sube empujando. Abdomen firme.',tip:'Codos a unos 45 grados del cuerpo, no abiertos del todo.'},
 pushup:{a:'pushup',e:'💪',n:'Flexión',d:'En plancha con manos bajo los hombros. Baja el pecho hasta cerca del suelo y sube, cuerpo en línea recta.',v:'Cuerpo recto, baja y sube.',tip:'Si se hunde la cadera, pasa a flexión con rodillas.'},
 pushup_slow:{a:'pushup_slow',e:'🐢',n:'Flexión lenta',d:'Flexión bajando en 3 segundos y subiendo en 3 segundos.',v:'Tres segundos abajo, tres arriba.',tip:'La lentitud es la dificultad: no hace falta hacer muchas.'},
 shouldertap_knee:{a:'shouldertap_knee',e:'👋',n:'Toques de hombro con rodillas',d:'En plancha con rodillas, toca con una mano el hombro contrario y alterna.',v:'Toca el hombro, alterna. Cadera quieta.',tip:'Separa un poco las rodillas para estar más estable.'},
 shouldertap:{a:'shouldertap',e:'👋',n:'Toques de hombro en plancha',d:'En plancha alta, toca con una mano el hombro contrario y alterna, sin balancear la cadera.',v:'Toca el hombro y alterna. Cadera quieta.',tip:'Pies más separados = más fácil; pies juntos = más difícil.'},
 shouldertap_hard:{a:'shouldertap',e:'👋',n:'Toques de hombro, pies juntos',d:'Plancha alta con los pies juntos. Toca el hombro contrario despacio y alterna.',v:'Pies juntos, toques lentos. Nada se mueve.',tip:'Cuenta dos segundos en cada toque.'},
 floordip:{a:'floordip',e:'🦀',n:'Fondos en el suelo',d:'Sentada, manos detrás con los dedos hacia ti y rodillas dobladas. Sube la cadera y dobla y estira los codos.',v:'Dobla los codos hacia atrás y estira.',tip:'Nivel fácil: movimiento pequeño. Hombros lejos de las orejas.'},
 floordip_leg:{a:'floordip_leg',e:'🦀',n:'Fondos con pierna estirada',d:'Igual que los fondos en el suelo, pero con una pierna estirada. A mitad, cambia de pierna.',v:'Codos atrás y estira. Cambia de pierna a mitad.',tip:'Mantén la cadera alta todo el rato.'},
 downdog:{a:'downdog',e:'🐕',n:'Perro boca abajo pedaleando',d:'Manos y pies en el suelo con la cadera arriba, como una V invertida. Dobla una rodilla y luego la otra.',v:'Cadera arriba, pedalea suave.',tip:'Puedes tener las rodillas dobladas: lo importante es la espalda larga.'},
 pike:{a:'pike',e:'🔺',n:'Flexión en pica',d:'Desde la V invertida, dobla los codos acercando la cabeza al suelo entre las manos y sube.',v:'Cadera arriba, cabeza hacia el suelo, sube.',tip:'Trabaja los hombros. Acerca los pies a las manos para hacerla más difícil.'},
 pike_slow:{a:'pike',e:'🔺',n:'Flexión en pica lenta',d:'Flexión en pica bajando en 3 segundos.',v:'Baja en tres segundos, sube.',tip:'Codos hacia atrás, no hacia los lados.'},
 plank_knee:{a:'plank_knee',e:'🧱',n:'Plancha con rodillas',d:'Antebrazos o manos en el suelo y rodillas apoyadas. Cuerpo recto de rodillas a cabeza. Aguanta.',v:'Abdomen firme. Respira.',tip:'Mira al suelo para no forzar el cuello.'},
 plank:{a:'plank',e:'🧱',n:'Plancha',d:'Manos bajo los hombros y piernas estiradas. Cuerpo en línea recta. Aguanta.',v:'Cuerpo recto, respira tranquila.',tip:'Si se hunde la lumbar, apoya las rodillas.'},
 plankleg:{a:'plankleg',e:'🧱',n:'Plancha con pierna arriba',d:'En plancha, sube una pierna estirada un palmo y bájala. Alterna.',v:'Plancha firme, sube una pierna, alterna.',tip:'La cadera no se gira al subir la pierna.'},
 plankdog:{a:'plankdog',e:'🔁',n:'Plancha a perro',d:'Desde plancha, empuja la cadera arriba hasta la V invertida y vuelve a la plancha.',v:'Cadera arriba, vuelve a plancha.',tip:'Nivel fácil: hazlo con las rodillas apoyadas en la plancha.'},
 scap:{a:'scap',e:'🪽',n:'Flexión de escápulas',d:'En plancha con brazos estirados, deja que el pecho baje juntando las escápulas y luego empuja el suelo separándolas.',v:'Junta las escápulas, empuja el suelo.',tip:'Los codos no se doblan. Nivel fácil: con rodillas apoyadas.'},
 /* Abdomen y core */
 deadbug_easy:{a:'deadbug_easy',e:'🐞',n:'Bicho muerto fácil',d:'Boca arriba, brazos al techo y rodillas en mesa. Baja un pie a tocar el suelo y vuelve. Alterna.',v:'Toca el suelo con un pie, vuelve. Alterna.',tip:'La zona lumbar pegada a la esterilla.'},
 deadbug:{a:'deadbug',e:'🐞',n:'Bicho muerto',d:'Boca arriba, brazos al techo y rodillas en mesa. Estira a la vez un brazo atrás y la pierna contraria. Vuelve y alterna.',v:'Brazo y pierna contraria lejos. Vuelve. Lumbar pegada.',tip:'Exhala al estirar. Si la lumbar se despega, no estires tanto.'},
 deadbug_slow:{a:'deadbug',e:'🐞',n:'Bicho muerto lento',d:'Bicho muerto estirando en 3 segundos y parando un segundo con el brazo y la pierna lejos.',v:'Estira lento, aguanta, vuelve.',tip:'La lentitud es lo que lo hace difícil.'},
 crunch:{a:'crunch',e:'🌙',n:'Encogimiento',d:'Boca arriba, rodillas dobladas. Sube cabeza y hombros mirando a las rodillas y baja despacio.',v:'Sube los hombros, baja lento.',tip:'Deja un puño de espacio entre barbilla y pecho.'},
 crunch_tt:{a:'crunch_tt',e:'🌙',n:'Encogimiento con piernas en mesa',d:'Con las rodillas en el aire a 90 grados, sube cabeza y hombros y baja despacio.',v:'Piernas quietas, sube y baja.',tip:'Exhala al subir.'},
 situp:{a:'situp',e:'⬆️',n:'Abdominal completo',d:'Boca arriba, rodillas dobladas. Sube hasta sentarte y baja vértebra a vértebra.',v:'Sube hasta sentarte, baja despacio.',tip:'Si tiras del cuello, lleva los brazos al frente.'},
 sideplank_knee:{sd:2,a:'sideplank_knee',e:'📐',n:'Plancha lateral con rodilla',d:'De lado sobre el antebrazo y la rodilla de abajo. Sube la cadera formando una línea. Aguanta y cambia de lado.',v:'Cadera arriba, aguanta.',tip:'El codo queda justo debajo del hombro.'},
 sideplank:{sd:2,a:'sideplank',e:'📐',n:'Plancha lateral',d:'De lado sobre el antebrazo y el borde del pie. Cadera arriba, cuerpo recto. Aguanta y cambia de lado.',v:'Cuerpo recto como una tabla. Aguanta.',tip:'Para hacerlo más fácil, apoya la rodilla de abajo.'},
 sideplank_dip:{sd:2,a:'sideplank_dip',e:'📐',n:'Plancha lateral con bajadas',d:'En plancha lateral, baja la cadera casi al suelo y súbela. Cambia de lado.',v:'Baja la cadera y sube.',tip:'Movimiento controlado, sin tirones.'},
 legraise_single:{a:'legraise_single',e:'🦵',n:'Elevación de una pierna',d:'Boca arriba, piernas estiradas. Sube una pierna hacia el techo y bájala sin tocar el suelo. Alterna.',v:'Una pierna arriba, baja lento. Alterna.',tip:'Manos bajo los glúteos si notas la lumbar.'},
 reversecrunch:{a:'reversecrunch',e:'🔃',n:'Encogimiento inverso',d:'Boca arriba, rodillas en mesa. Lleva las rodillas hacia el pecho despegando un poco la cadera y baja despacio.',v:'Rodillas al pecho, baja lento.',tip:'Sin impulso: el movimiento es pequeño.'},
 legraise:{a:'legraise',e:'🦵',n:'Elevación de piernas',d:'Boca arriba, piernas juntas y estiradas. Súbelas hasta el techo y bájalas despacio sin tocar el suelo.',v:'Piernas arriba, bajada lenta.',tip:'Si la lumbar se despega, dobla un poco las rodillas.'},
 birddog_easy:{a:'birddog_easy',e:'🐦',n:'Perro de caza fácil',d:'A cuatro patas, estira un brazo al frente y vuelve; luego la pierna contraria atrás. Alterna.',v:'Estira un brazo, vuelve. Luego la pierna.',tip:'Espalda plana como una mesa.'},
 birddog:{a:'birddog',e:'🐦',n:'Perro de caza',d:'A cuatro patas, estira a la vez un brazo al frente y la pierna contraria atrás. Vuelve y alterna.',v:'Brazo y pierna contraria largos. Vuelve y cambia.',tip:'Imagina un vaso de agua sobre la espalda que no se puede caer.'},
 birddog_crunch:{a:'birddog_crunch',e:'🐦',n:'Perro de caza con codo a rodilla',d:'Estira brazo y pierna contraria, luego júntalos bajo el cuerpo codo con rodilla. A mitad, cambia de lado.',v:'Estira largo, codo a rodilla.',tip:'Hazlo lento para no perder el equilibrio.'},
 hollow_tuck:{a:'hollow_tuck',e:'🥚',n:'Barquito recogido',d:'Boca arriba, sube hombros y brazos, y rodillas dobladas en el aire. Lumbar pegada. Aguanta.',v:'Lumbar pegada, aguanta. Respira.',tip:'Cuanto más cerca las rodillas, más fácil.'},
 hollow:{a:'hollow',e:'🛶',n:'Barquito',d:'Boca arriba, brazos atrás y piernas estiradas, todo un poco despegado del suelo. Lumbar pegada. Aguanta.',v:'Cuerpo en forma de barca. Aguanta.',tip:'Sube más las piernas si se despega la lumbar.'},
 hollowrock:{a:'hollowrock',e:'🛶',n:'Barquito balanceo',d:'En posición de barquito, balancéate adelante y atrás sin romper la forma.',v:'Forma de barca, balancéate.',tip:'Si se rompe la forma, vuelve a aguantar quieta.'},
 /* Espalda y postura */
 swimming:{a:'swimming',e:'🏊',n:'Natación',d:'Boca abajo, brazos al frente. Sube a la vez un brazo y la pierna contraria y alterna, como nadando.',v:'Brazo y pierna contraria arriba. Alterna.',tip:'Mira al suelo para no forzar el cuello.'},
 superman:{a:'superman',e:'🦸',n:'Superman',d:'Boca abajo, brazos al frente. Sube a la vez brazos, pecho y piernas un palmo, y baja.',v:'Todo arriba, un segundo, abajo.',tip:'Aprieta los glúteos para proteger la zona lumbar.'},
 supermanhold:{a:'supermanhold',e:'🦸',n:'Superman mantenido',d:'Sube brazos, pecho y piernas y quédate arriba respirando.',v:'Arriba y aguanta.',tip:'Mejor poca altura bien hecha que mucha forzada.'},
 proneY:{a:'proneY',e:'🙆',n:'Elevaciones en Y',d:'Boca abajo, brazos al frente en forma de Y y pulgares hacia arriba. Sube los brazos juntando las escápulas y baja.',v:'Brazos en Y arriba, escápulas juntas.',tip:'Los hombros bajan lejos de las orejas.'},
 proneY_slow:{a:'proneY',e:'🙆',n:'Elevaciones en Y con pausa',d:'Elevaciones en Y aguantando 2 segundos arriba.',v:'Arriba, aguanta, baja.',tip:'Nada de impulso: sube con la espalda.'},
 bear:{a:'bear',e:'🐻',n:'Oso',d:'A cuatro patas, despega las rodillas 2 centímetros del suelo y aguanta con la espalda plana.',v:'Rodillas flotando. Aguanta.',tip:'Si cuesta mucho, baja las rodillas y vuelve a subir.'},
 beartap:{a:'beartap',e:'🐻',n:'Oso con toques',d:'En posición de oso, toca el hombro contrario con una mano y alterna.',v:'Rodillas flotando, toca el hombro, alterna.',tip:'La cadera no se balancea.'},
 swimming_fast:{a:'swimming',e:'🏊',n:'Natación rápida',d:'Natación boca abajo con un ritmo más vivo, sin perder la altura.',v:'Brazo y pierna contraria, ritmo vivo.',tip:'Respira con calma aunque el ritmo sea rápido.'},
 /* Cuerpo completo */
 climber_slow:{a:'climber_slow',e:'⛰️',n:'Escalador lento',d:'En plancha, lleva una rodilla hacia el pecho, vuelve y cambia. Despacio.',v:'Rodilla al pecho, alterna despacio.',tip:'Hombros encima de las manos.'},
 climber:{a:'climber',e:'⛰️',n:'Escalador',d:'En plancha, alterna rodillas al pecho con ritmo, como si corrieras.',v:'Rodillas al pecho, ritmo vivo.',tip:'La cadera baja, en línea con los hombros.'},
 burpee_step:{a:'burpee_step',e:'🔁',n:'Burpee sin salto',d:'De pie, agáchate con las manos al suelo, lleva los pies atrás a plancha paso a paso, vuelve y ponte de pie.',v:'Abajo, pies atrás, pies delante, arriba.',tip:'Sin prisa: cada paso bien hecho.'},
 burpee:{a:'burpee',e:'🔥',n:'Burpee',d:'Agáchate, salta a plancha, vuelve con los pies a las manos y salta arriba con los brazos al techo.',v:'Abajo, plancha, vuelve y salta.',tip:'Si necesitas, quita el salto final.'},
 /* Estiramientos */
 childpose:{a:'childpose',e:'🧎',n:'Postura del niño',d:'De rodillas, siéntate sobre los talones y estira los brazos delante con la frente en el suelo.',v:'Respira hacia la espalda.',tip:'Separa las rodillas si te resulta más cómodo.'},
 childreach:{a:'childreach',e:'🧎',n:'Del niño a cuatro patas',d:'Desde cuatro patas, lleva la cadera a los talones y vuelve, despacio.',v:'Cadera atrás, respira, vuelve.',tip:'Déjate caer suave, sin forzar.'},
 thread:{a:'thread',e:'🧵',n:'Enhebrar la aguja',d:'A cuatro patas, pasa un brazo por debajo del cuerpo y apoya el hombro en el suelo.',v:'Brazo por debajo, hombro al suelo. Respira.',tip:'Abre la parte alta de la espalda. Sin prisa.'},
 sphinx:{a:'sphinx',e:'🦁',n:'Esfinge',d:'Boca abajo, apoyada en los antebrazos con los codos bajo los hombros. Pecho abierto.',v:'Pecho abierto, hombros lejos de las orejas.',tip:'Si molesta la lumbar, adelanta los codos.'},
 cobra:{a:'cobra',e:'🐍',n:'Cobra suave',d:'Boca abajo, manos bajo los hombros. Sube el pecho con la espalda, sin estirar del todo los brazos.',v:'Sube el pecho, baja suave.',tip:'La altura no importa. Nada de dolor.'},
 figure4:{a:'figure4',e:'4️⃣',n:'Figura 4',d:'Boca arriba, cruza un tobillo sobre la rodilla contraria y acerca las piernas al pecho.',v:'Respira hacia el glúteo.',tip:'Si es mucho, deja el pie de abajo en el suelo.'},
 hamstring:{a:'hamstring',e:'🦵',n:'Estiramiento de isquios',d:'Boca arriba, sube una pierna estirada y sujétala por detrás del muslo.',v:'Pierna arriba, respira y suelta.',tip:'Puedes doblar un poco la rodilla.'},
 seatedfwd:{a:'seatedfwd',e:'🙇',n:'Pinza sentada',d:'Sentada con las piernas estiradas, inclínate hacia delante desde la cadera, sin forzar.',v:'Inclínate desde la cadera, respira.',tip:'Dobla las rodillas si tiran mucho.'},
 butterfly:{a:'butterfly',e:'🦋',n:'Mariposa',d:'Sentada, junta las plantas de los pies y deja caer las rodillas. Inclínate un poco hacia delante.',v:'Rodillas abiertas, respira.',tip:'No empujes las rodillas con los codos.'},
 sidequad:{a:'sidequad',e:'🦩',n:'Cuádriceps de lado',d:'Tumbada de lado, lleva el talón de arriba al glúteo sujetando el tobillo.',v:'Talón al glúteo, rodillas juntas.',tip:'Si no llegas al tobillo, sujeta el pantalón.'},
 lowlunge:{a:'lowlunge',e:'🧎',n:'Zancada baja',d:'Una rodilla en la esterilla y el otro pie delante. Lleva la cadera un poco adelante.',v:'Cadera adelante, tronco alto.',tip:'Pon algo blando bajo la rodilla si molesta.'},
 yogisquat:{a:'yogisquat',e:'🧘',n:'Sentadilla profunda',d:'Pies abiertos, baja a una sentadilla profunda con las manos juntas delante del pecho.',v:'Baja y respira.',tip:'Si los talones se levantan, abre más los pies.'},
 spinaltwist:{a:'spinaltwist',e:'🌀',n:'Torsión tumbada',d:'Boca arriba, rodillas dobladas. Déjalas caer hacia un lado con los brazos en cruz.',v:'Rodillas a un lado, respira.',tip:'Deja que el peso de las piernas haga el trabajo.'},
 kneehug:{a:'kneehug',e:'🤗',n:'Rodillas al pecho',d:'Boca arriba, abraza las rodillas y balancéate suave hacia delante y hacia atrás.',v:'Abraza las rodillas, balancéate suave.',tip:'Es un masaje para la zona lumbar.'},
 tricepstretch:{a:'tricepstretch',e:'💪',n:'Estiramiento de tríceps',d:'De pie, sube un brazo, dobla el codo y lleva la mano a la espalda. La otra mano empuja suave el codo.',v:'Codo arriba, empuja suave.',tip:'Mantén el cuello relajado.'},
 neck:{a:'neck',e:'🙂',n:'Movilidad de cuello',d:'De pie o sentada, lleva la barbilla al pecho despacio y vuelve a mirar al frente.',v:'Barbilla al pecho, despacio, y vuelve.',tip:'Nunca eches la cabeza hacia atrás.'},
 shouldercircle:{a:'shouldercircle',e:'🔄',n:'Círculos de hombros',d:'Manos en los hombros, dibuja círculos grandes con los codos.',v:'Círculos grandes con los codos.',tip:'A mitad, cambia de sentido.'},
 hiphinge:{a:'hiphinge',e:'🙇',n:'Bisagra de cadera',d:'De pie, brazos cruzados en el pecho. Lleva la cadera atrás e inclina el cuerpo con la espalda recta. Vuelve arriba.',v:'Cadera atrás, espalda larga, vuelve arriba.',tip:'Rodillas un poco sueltas, sin agacharte.'},
 goodmorning:{a:'goodmorning',e:'🌅',n:'Buenos días',d:'De pie, brazos cruzados en el pecho. Lleva la cadera atrás e inclina el cuerpo hasta casi la horizontal, espalda recta. Sube apretando glúteos.',v:'Cadera atrás, espalda recta, sube apretando glúteos.',tip:'Baja solo hasta donde la espalda siga recta.'},
 sldl:{a:'sldl',e:'🦢',n:'Peso muerto a una pierna',d:'De pie sobre una pierna. Inclina el cuerpo adelante mientras la otra pierna se estira atrás, como un balancín. Vuelve arriba.',v:'Cuerpo y pierna en línea, como un balancín.',tip:'Si pierdes el equilibrio, apoya la punta del pie de atrás.',sd:2},
 pelvictilt:{a:'pelvictilt',e:'🌊',n:'Báscula de pelvis',d:'Boca arriba, rodillas dobladas. Despega un poco la cadera enrollando la espalda desde abajo y baja despacio.',v:'Enrolla la pelvis, sube un poco, baja despacio.',tip:'Es un movimiento pequeño y suave.'},
 proneW:{a:'proneW',e:'🦅',n:'Pecho arriba, brazos atrás',d:'Tumbada boca abajo, brazos estirados junto al cuerpo. Despega pecho y brazos del suelo juntando los omóplatos y baja despacio.',v:'Brazos atrás, junta los omóplatos, mira al suelo.',tip:'Sube poco: el trabajo está en la espalda alta.'},
 rockback:{a:'rockback',e:'🐾',n:'Balanceo a cuatro patas',d:'A cuatro patas, con las rodillas separadas. Lleva despacio la cadera hacia los talones y vuelve.',v:'Cadera atrás hacia los talones, suelta el aire.',tip:'Baja solo hasta donde estés cómoda.'},
 gluteknee:{a:'gluteknee',e:'🤗',n:'Rodilla al pecho',d:'Boca arriba, con una pierna estirada en la esterilla. Abraza la otra rodilla y acércala al pecho.',v:'Abraza la rodilla, acércala al pecho y respira.',tip:'Si no llegas a la rodilla, sujeta por detrás del muslo.'},
 donkey:{a:'donkey',e:'🐴',n:'Patada de glúteo',d:'A cuatro patas. Con la rodilla doblada, sube el talón hacia el techo y bájalo despacio. Luego, la otra pierna.',v:'Talón al techo, aprieta el glúteo, espalda quieta.',tip:'Sube solo hasta donde la espalda no se arquea.',sd:2},
 squathold_half:{a:'squathold_half',e:'🪑',n:'Media sentadilla mantenida',d:'Baja a media altura, como si fueras a sentarte en una silla alta, y quédate ahí respirando.',v:'Cadera atrás, pecho alto, respira.',tip:'Si tiemblan las piernas, sube un poco: también cuenta.'},
 breathe:{a:'breathe',e:'🌬️',n:'Respiración tumbada',d:'Tumbada boca arriba, cierra los ojos. Inhala en 4 tiempos y exhala en 6.',v:'Inhala en cuatro, exhala en seis.',tip:'Deja que el cuerpo pese sobre la esterilla.'}
};

/* ─── PROGRAMA ───
   L-V: calentamiento + circuito de 6 (3 variantes: fácil/medio/difícil) × 2 rondas + vuelta a la calma.
   S-D: estiramientos extra. sides:2 = se hace a cada lado. */
const WARMUP=[['march',40],['armcircle',30],['hiphinge',30],['catcow',40]];
const WEEK=[
 {id:'lun',emoji:'🦵',color:'linear-gradient(135deg,#0369a1,#0891b2)',
  circuit:[['squat_half','squat','jumpsquat'],['donkey','lunge','lunge_knee'],['bridge','bridgehold','bridge1leg'],['goodmorning','goodmorning','sldl'],['calfraise','calfraise','calfraise_slow'],['squathold_half','squathold','squathold']],
  cool:[['lowlunge',30,2],['gluteknee',30,2]]},
 {id:'mar',emoji:'💪',color:'linear-gradient(135deg,#be185d,#ec4899)',
  circuit:[['pushup_knee','pushup','pushup_slow'],['shouldertap_knee','shouldertap','shouldertap_hard'],['floordip','floordip','floordip_leg'],['downdog','pike','pike_slow'],['plank_knee','plank','plankleg'],['proneW','plankdog','plankdog']],
  cool:[['childpose',45,1],['tricepstretch',30,2]]},
 {id:'mie',emoji:'🎯',color:'linear-gradient(135deg,#7c3aed,#a855f7)',
  circuit:[['deadbug_easy','deadbug','deadbug_slow'],['crunch','crunch_tt','situp'],['plank_knee','sideplank','sideplank_dip'],['legraise_single','reversecrunch','legraise'],['birddog_easy','birddog','birddog_crunch'],['hollow_tuck','hollow','hollowrock']],
  cool:[['sphinx',45,1],['kneehug',45,1]]},
 {id:'jue',emoji:'🌿',color:'linear-gradient(135deg,#059669,#10b981)',
  circuit:[['swimming','superman','supermanhold'],['proneY','proneY','proneY_slow'],['proneW','proneW','proneW'],['bridge','bridgemarch','bridge1leg'],['bear','bear','birddog'],['swimming','swimming','swimming_fast']],
  cool:[['childpose',45,1],['sphinx',30,1]]},
 {id:'vie',emoji:'🔥',color:'linear-gradient(135deg,#d97706,#f59e0b)',
  circuit:[['squat_half','squat','jumpsquat'],['pushup_knee','pushup','pushup_slow'],['climber_slow','climber','climber'],['lunge_short','lunge','lunge_knee'],['burpee_step','burpee_step','burpee'],['plank_knee','plank','plankleg']],
  cool:[['hamstring',30,2],['pelvictilt',30,1]]},
 {id:'sab',emoji:'🧘',color:'linear-gradient(135deg,#0f766e,#14b8a6)',stretch:true,
  list:[['breathe',45,1],['kneehug',45,1],['hamstring',40,2],['gluteknee',40,2],['pelvictilt',40,1],['rockback',60,1],['lowlunge',40,2],['sidequad',40,2],['yogisquat',45,1],['childpose',60,1],['breathe',60,1]]},
 {id:'dom',emoji:'☀️',color:'linear-gradient(135deg,#1a6b64,#26a69a)',stretch:true,
  list:[['catcow',60,1],['hamstring',40,2],['childreach',60,1],['sphinx',60,1],['cobra',45,1],['seatedfwd',60,1],['tricepstretch',40,2],['shouldercircle',45,1],['neck',45,1],['kneehug',45,1],['breathe',60,1]]}
];
/* Trabajo/descanso (s) por nivel y semana de progreso (0-3) */
const LEVEL_TIMES={
 0:{w:[30,30,35,35],r:[30,30,25,25]},
 1:{w:[40,40,45,45],r:[20,20,15,15]},
 2:{w:[45,50,50,50],r:[15,10,10,10]}
};

/* Tempo de cada ejercicio, igual que su ficha técnica.
   [ida, pausa, vuelta, pausa] en segundos (ida = de la 1.ª postura a la 2.ª) · un número = duración del ciclo */
const TEMPO={
 catcow:[3,0,3,0],squat_half:[2,0,1,0],squat:[3,0,1,0],jumpsquat:3,lunge_short:[2,0,1,0],lunge:[2,0,1,0],lunge_knee:4,
 sumo:[2,0,1,0],sumo_pulse:[2,0,1,0],calfraise:[1,.5,2,0],calfraise_slow:[1,2,3,0],bridge:[1,1,2,0],bridge1leg:[1,1,2,0],
 pushup_knee:[2,0,1,0],pushup:[2,0,1,0],pushup_slow:[3,0,3,0],shouldertap_hard:[2,0,2,0],floordip:[2,0,1,0],floordip_leg:[2,0,1,0],
 pike:[2,0,1,0],pike_slow:[3,.5,1,0],plankdog:[2,0,2,0],scap:[2,0,2,0],deadbug_easy:[2,0,1,0],deadbug:7,deadbug_slow:12,
 crunch:[1,1,2.5,0],crunch_tt:[1,1,2.5,0],situp:[2,0,3,0],sideplank_dip:[1,0,2,0],reversecrunch:[1,1,3,0],legraise:[2,0,3,0],
 legraise_single:[2,0,3,0],birddog:10,birddog_crunch:5,hollowrock:[1,0,1,0],superman:[1,1,2,0],proneY:[1,.5,2,0],proneY_slow:[2,2,2,0],
 climber_slow:4,childreach:[3,1,3,0],gluteknee:[3,1,3,0],hiphinge:[2,0,2,0],goodmorning:[3,0,2,0],sldl:[3,0,2,0],pelvictilt:[2,1,2,0],proneW:[1,1,2,0],rockback:[3,1,3,0],donkey:[1,1,2,0]
};
for(const k in TEMPO)if(EX[k])EX[k].tp=TEMPO[k];
