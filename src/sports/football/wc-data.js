// World Cup group assignments and knockout results for all 22 tournaments (1930–2022).
// Team names use canonical post-nameMap values (West Germany→Germany, Soviet Union→Russia, etc.)

export var WC_DATA = {
  1930: {
    groups: {
      "Group A":["Argentina","Chile","France","Mexico"],
      "Group B":["Brazil","Bolivia","Serbia"],
      "Group C":["Uruguay","Romania","Peru"],
      "Group D":["United States","Paraguay","Belgium"]
    },
    knockout:[
      {round:"Semi-final",home:"Argentina",away:"United States",hs:6,as:1},
      {round:"Semi-final",home:"Uruguay",away:"Serbia",hs:6,as:1},
      {round:"Final",home:"Uruguay",away:"Argentina",hs:4,as:2}
    ]
  },
  1934: {
    groups: null,
    knockout:[
      {round:"Round of 16",home:"Italy",away:"United States",hs:7,as:1},
      {round:"Round of 16",home:"Spain",away:"Brazil",hs:3,as:1},
      {round:"Round of 16",home:"Austria",away:"France",hs:3,as:2,note:"aet"},
      {round:"Round of 16",home:"Hungary",away:"Egypt",hs:4,as:2},
      {round:"Round of 16",home:"Germany",away:"Belgium",hs:5,as:2},
      {round:"Round of 16",home:"Sweden",away:"Argentina",hs:3,as:2},
      {round:"Round of 16",home:"Switzerland",away:"Netherlands",hs:3,as:2},
      {round:"Round of 16",home:"Czechia",away:"Romania",hs:2,as:1},
      {round:"Quarter-final",home:"Germany",away:"Sweden",hs:2,as:1},
      {round:"Quarter-final",home:"Austria",away:"Hungary",hs:2,as:1},
      {round:"Quarter-final",home:"Italy",away:"Spain",hs:1,as:0,note:"Replay after 1–1 aet"},
      {round:"Quarter-final",home:"Czechia",away:"Switzerland",hs:3,as:2},
      {round:"Semi-final",home:"Italy",away:"Austria",hs:1,as:0},
      {round:"Semi-final",home:"Czechia",away:"Germany",hs:3,as:1},
      {round:"3rd Place",home:"Germany",away:"Austria",hs:3,as:2},
      {round:"Final",home:"Italy",away:"Czechia",hs:2,as:1,note:"aet"}
    ]
  },
  1938: {
    groups: null,
    knockout:[
      {round:"Round of 16",home:"Switzerland",away:"Germany",hs:4,as:2,note:"Replay after 1–1 aet"},
      {round:"Round of 16",home:"Cuba",away:"Romania",hs:2,as:1,note:"Replay after 3–3 aet"},
      {round:"Round of 16",home:"Hungary",away:"Indonesia",hs:6,as:0},
      {round:"Round of 16",home:"France",away:"Belgium",hs:3,as:1},
      {round:"Round of 16",home:"Czechia",away:"Netherlands",hs:3,as:0},
      {round:"Round of 16",home:"Brazil",away:"Poland",hs:6,as:5,note:"aet"},
      {round:"Round of 16",home:"Italy",away:"Norway",hs:2,as:1,note:"aet"},
      {round:"Quarter-final",home:"Sweden",away:"Cuba",hs:8,as:0,note:"Sweden had R16 bye (Austria withdrew)"},
      {round:"Quarter-final",home:"Hungary",away:"Switzerland",hs:2,as:0},
      {round:"Quarter-final",home:"Italy",away:"France",hs:3,as:1},
      {round:"Quarter-final",home:"Brazil",away:"Czechia",hs:2,as:1,note:"Replay after 1–1 aet"},
      {round:"Semi-final",home:"Hungary",away:"Sweden",hs:5,as:1},
      {round:"Semi-final",home:"Italy",away:"Brazil",hs:2,as:1},
      {round:"3rd Place",home:"Brazil",away:"Sweden",hs:4,as:2},
      {round:"Final",home:"Italy",away:"Hungary",hs:4,as:2}
    ]
  },
  1950: {
    groups: {
      "Group 1":["Brazil","Serbia","Switzerland","Mexico"],
      "Group 2":["Spain","England","Chile","United States"],
      "Group 3":["Sweden","Italy","Paraguay"],
      "Group 4":["Uruguay","Bolivia"],
      "Final Pool":["Uruguay","Brazil","Spain","Sweden"]
    },
    knockout:[
      {round:"Deciding match",home:"Uruguay",away:"Brazil",hs:2,as:1,note:"Final Pool decider — the Maracanazo"}
    ]
  },
  1954: {
    groups: {
      "Group 1":["Brazil","Serbia","France","Mexico"],
      "Group 2":["Hungary","Germany","Turkey","South Korea"],
      "Group 3":["Uruguay","Austria","Czechia","Scotland"],
      "Group 4":["England","Italy","Switzerland","Belgium"]
    },
    knockout:[
      {round:"Quarter-final",home:"Germany",away:"Serbia",hs:2,as:0},
      {round:"Quarter-final",home:"Hungary",away:"Brazil",hs:4,as:2},
      {round:"Quarter-final",home:"Austria",away:"Switzerland",hs:7,as:5},
      {round:"Quarter-final",home:"Uruguay",away:"England",hs:4,as:2},
      {round:"Semi-final",home:"Hungary",away:"Uruguay",hs:4,as:2,note:"aet"},
      {round:"Semi-final",home:"Germany",away:"Austria",hs:6,as:1},
      {round:"3rd Place",home:"Austria",away:"Uruguay",hs:3,as:1},
      {round:"Final",home:"Germany",away:"Hungary",hs:3,as:2}
    ]
  },
  1958: {
    groups: {
      "Group 1":["Germany","Northern Ireland","Czechia","Argentina"],
      "Group 2":["France","Serbia","Paraguay","Scotland"],
      "Group 3":["Sweden","Hungary","Wales","Mexico"],
      "Group 4":["Brazil","England","Russia","Austria"]
    },
    knockout:[
      {round:"Quarter-final",home:"Germany",away:"Serbia",hs:1,as:0},
      {round:"Quarter-final",home:"France",away:"Northern Ireland",hs:4,as:0},
      {round:"Quarter-final",home:"Sweden",away:"Russia",hs:2,as:0},
      {round:"Quarter-final",home:"Brazil",away:"Wales",hs:1,as:0},
      {round:"Semi-final",home:"Brazil",away:"France",hs:5,as:2},
      {round:"Semi-final",home:"Sweden",away:"Germany",hs:3,as:1},
      {round:"3rd Place",home:"France",away:"Germany",hs:6,as:3},
      {round:"Final",home:"Brazil",away:"Sweden",hs:5,as:2}
    ]
  },
  1962: {
    groups: {
      "Group 1":["Russia","Serbia","Uruguay","Colombia"],
      "Group 2":["Germany","Chile","Italy","Switzerland"],
      "Group 3":["Brazil","Spain","Czechia","Mexico"],
      "Group 4":["Hungary","England","Argentina","Bulgaria"]
    },
    knockout:[
      {round:"Quarter-final",home:"Serbia",away:"Germany",hs:1,as:0},
      {round:"Quarter-final",home:"Brazil",away:"England",hs:3,as:1},
      {round:"Quarter-final",home:"Chile",away:"Russia",hs:2,as:1},
      {round:"Quarter-final",home:"Czechia",away:"Hungary",hs:1,as:0},
      {round:"Semi-final",home:"Brazil",away:"Chile",hs:4,as:2},
      {round:"Semi-final",home:"Czechia",away:"Serbia",hs:3,as:1},
      {round:"3rd Place",home:"Chile",away:"Serbia",hs:1,as:0},
      {round:"Final",home:"Brazil",away:"Czechia",hs:3,as:1}
    ]
  },
  1966: {
    groups: {
      "Group 1":["England","Uruguay","Mexico","France"],
      "Group 2":["Germany","Argentina","Spain","Switzerland"],
      "Group 3":["Portugal","Hungary","Brazil","Bulgaria"],
      "Group 4":["Russia","North Korea","Italy","Chile"]
    },
    knockout:[
      {round:"Quarter-final",home:"England",away:"Argentina",hs:1,as:0},
      {round:"Quarter-final",home:"Germany",away:"Uruguay",hs:4,as:0},
      {round:"Quarter-final",home:"Portugal",away:"North Korea",hs:5,as:3},
      {round:"Quarter-final",home:"Russia",away:"Hungary",hs:2,as:1},
      {round:"Semi-final",home:"England",away:"Portugal",hs:2,as:1},
      {round:"Semi-final",home:"Germany",away:"Russia",hs:2,as:1},
      {round:"3rd Place",home:"Portugal",away:"Russia",hs:2,as:1},
      {round:"Final",home:"England",away:"Germany",hs:4,as:2,note:"aet"}
    ]
  },
  1970: {
    groups: {
      "Group 1":["Mexico","Russia","Belgium","El Salvador"],
      "Group 2":["Uruguay","Italy","Sweden","Israel"],
      "Group 3":["Brazil","England","Romania","Czechia"],
      "Group 4":["Germany","Peru","Bulgaria","Morocco"]
    },
    knockout:[
      {round:"Quarter-final",home:"Uruguay",away:"Russia",hs:1,as:0,note:"aet"},
      {round:"Quarter-final",home:"Italy",away:"Mexico",hs:4,as:1},
      {round:"Quarter-final",home:"Brazil",away:"Peru",hs:4,as:2},
      {round:"Quarter-final",home:"Germany",away:"England",hs:3,as:2,note:"aet"},
      {round:"Semi-final",home:"Italy",away:"Germany",hs:4,as:3,note:"aet — Game of the Century"},
      {round:"Semi-final",home:"Brazil",away:"Uruguay",hs:3,as:1},
      {round:"3rd Place",home:"Germany",away:"Uruguay",hs:1,as:0},
      {round:"Final",home:"Brazil",away:"Italy",hs:4,as:1}
    ]
  },
  1974: {
    groups: {
      "Group 1":["Germany","East Germany","Chile","Australia"],
      "Group 2":["Serbia","Brazil","Scotland","DR Congo"],
      "Group 3":["Netherlands","Sweden","Bulgaria","Uruguay"],
      "Group 4":["Poland","Argentina","Italy","Haiti"],
      "Second Round A":["Netherlands","Brazil","East Germany","Argentina"],
      "Second Round B":["Poland","Germany","Sweden","Serbia"]
    },
    knockout:[
      {round:"3rd Place",home:"Poland",away:"Brazil",hs:1,as:0},
      {round:"Final",home:"Germany",away:"Netherlands",hs:2,as:1}
    ]
  },
  1978: {
    groups: {
      "Group 1":["Italy","Argentina","France","Hungary"],
      "Group 2":["Germany","Poland","Tunisia","Mexico"],
      "Group 3":["Brazil","Austria","Spain","Sweden"],
      "Group 4":["Netherlands","Peru","Scotland","Iran"],
      "Second Round A":["Netherlands","Italy","Germany","Austria"],
      "Second Round B":["Argentina","Brazil","Poland","Peru"]
    },
    knockout:[
      {round:"3rd Place",home:"Brazil",away:"Italy",hs:2,as:1},
      {round:"Final",home:"Argentina",away:"Netherlands",hs:3,as:1,note:"aet"}
    ]
  },
  1982: {
    groups: {
      "Group 1":["Italy","Poland","Cameroon","Peru"],
      "Group 2":["Germany","Austria","Algeria","Chile"],
      "Group 3":["Argentina","Belgium","Hungary","El Salvador"],
      "Group 4":["England","France","Czechia","Kuwait"],
      "Group 5":["Spain","Serbia","Northern Ireland","Honduras"],
      "Group 6":["Brazil","Russia","Scotland","New Zealand"],
      "Second Round A":["Poland","Russia","Belgium"],
      "Second Round B":["Germany","England","Spain"],
      "Second Round C":["Italy","Argentina","Brazil"],
      "Second Round D":["France","Austria","Northern Ireland"]
    },
    knockout:[
      {round:"Semi-final",home:"Italy",away:"Poland",hs:2,as:0},
      {round:"Semi-final",home:"Germany",away:"France",hs:3,as:3,note:"Germany won on pens"},
      {round:"3rd Place",home:"Poland",away:"France",hs:3,as:2},
      {round:"Final",home:"Italy",away:"Germany",hs:3,as:1}
    ]
  },
  1986: {
    groups: {
      "Group A":["Bulgaria","Italy","Argentina","South Korea"],
      "Group B":["Mexico","Paraguay","Belgium","Iraq"],
      "Group C":["Russia","France","Hungary","Canada"],
      "Group D":["Brazil","Spain","Northern Ireland","Algeria"],
      "Group E":["Germany","Uruguay","Scotland","Denmark"],
      "Group F":["Morocco","England","Poland","Portugal"]
    },
    knockout:[
      {round:"Round of 16",home:"Mexico",away:"Bulgaria",hs:2,as:0},
      {round:"Round of 16",home:"Belgium",away:"Russia",hs:4,as:3,note:"aet"},
      {round:"Round of 16",home:"Argentina",away:"Uruguay",hs:1,as:0},
      {round:"Round of 16",home:"Brazil",away:"Poland",hs:4,as:0},
      {round:"Round of 16",home:"France",away:"Italy",hs:2,as:0},
      {round:"Round of 16",home:"Germany",away:"Morocco",hs:1,as:0},
      {round:"Round of 16",home:"England",away:"Paraguay",hs:3,as:0},
      {round:"Round of 16",home:"Spain",away:"Denmark",hs:5,as:1},
      {round:"Quarter-final",home:"Argentina",away:"England",hs:2,as:1,note:"Hand of God & Goal of the Century"},
      {round:"Quarter-final",home:"France",away:"Brazil",hs:1,as:1,note:"France won on pens"},
      {round:"Quarter-final",home:"Germany",away:"Mexico",hs:0,as:0,note:"Germany won on pens"},
      {round:"Quarter-final",home:"Belgium",away:"Spain",hs:1,as:1,note:"Belgium won on pens"},
      {round:"Semi-final",home:"Argentina",away:"Belgium",hs:2,as:0},
      {round:"Semi-final",home:"Germany",away:"France",hs:2,as:0},
      {round:"3rd Place",home:"France",away:"Belgium",hs:4,as:2,note:"aet"},
      {round:"Final",home:"Argentina",away:"Germany",hs:3,as:2}
    ]
  },
  1990: {
    groups: {
      "Group A":["Italy","Czechia","Austria","United States"],
      "Group B":["Cameroon","Romania","Argentina","Russia"],
      "Group C":["Brazil","Costa Rica","Scotland","Sweden"],
      "Group D":["Germany","Serbia","Colombia","United Arab Emirates"],
      "Group E":["Spain","Belgium","Uruguay","South Korea"],
      "Group F":["England","Ireland","Netherlands","Egypt"]
    },
    knockout:[
      {round:"Round of 16",home:"Cameroon",away:"Colombia",hs:2,as:1,note:"aet"},
      {round:"Round of 16",home:"Czechia",away:"Costa Rica",hs:4,as:1},
      {round:"Round of 16",home:"Argentina",away:"Brazil",hs:1,as:0},
      {round:"Round of 16",home:"Germany",away:"Netherlands",hs:2,as:1},
      {round:"Round of 16",home:"Ireland",away:"Romania",hs:0,as:0,note:"Ireland won on pens"},
      {round:"Round of 16",home:"Italy",away:"Uruguay",hs:2,as:0},
      {round:"Round of 16",home:"Serbia",away:"Spain",hs:2,as:1},
      {round:"Round of 16",home:"England",away:"Belgium",hs:1,as:0,note:"aet"},
      {round:"Quarter-final",home:"Argentina",away:"Serbia",hs:0,as:0,note:"Argentina won on pens"},
      {round:"Quarter-final",home:"Italy",away:"Ireland",hs:1,as:0},
      {round:"Quarter-final",home:"Germany",away:"Czechia",hs:1,as:0},
      {round:"Quarter-final",home:"England",away:"Cameroon",hs:3,as:2,note:"aet"},
      {round:"Semi-final",home:"Argentina",away:"Italy",hs:1,as:1,note:"Argentina won on pens"},
      {round:"Semi-final",home:"Germany",away:"England",hs:1,as:1,note:"Germany won on pens"},
      {round:"3rd Place",home:"Italy",away:"England",hs:2,as:1},
      {round:"Final",home:"Germany",away:"Argentina",hs:1,as:0}
    ]
  },
  1994: {
    groups: {
      "Group A":["Romania","Switzerland","Colombia","United States"],
      "Group B":["Brazil","Sweden","Russia","Cameroon"],
      "Group C":["Germany","Spain","South Korea","Bolivia"],
      "Group D":["Nigeria","Bulgaria","Argentina","Greece"],
      "Group E":["Italy","Mexico","Ireland","Norway"],
      "Group F":["Netherlands","Saudi Arabia","Belgium","Morocco"]
    },
    knockout:[
      {round:"Round of 16",home:"Germany",away:"Belgium",hs:3,as:2},
      {round:"Round of 16",home:"Spain",away:"Switzerland",hs:3,as:0},
      {round:"Round of 16",home:"Sweden",away:"Saudi Arabia",hs:3,as:1},
      {round:"Round of 16",home:"Romania",away:"Argentina",hs:3,as:2},
      {round:"Round of 16",home:"Netherlands",away:"Ireland",hs:2,as:0},
      {round:"Round of 16",home:"Brazil",away:"United States",hs:1,as:0},
      {round:"Round of 16",home:"Italy",away:"Nigeria",hs:2,as:1,note:"aet"},
      {round:"Round of 16",home:"Bulgaria",away:"Mexico",hs:1,as:1,note:"Bulgaria won on pens"},
      {round:"Quarter-final",home:"Bulgaria",away:"Germany",hs:2,as:1},
      {round:"Quarter-final",home:"Italy",away:"Spain",hs:2,as:1},
      {round:"Quarter-final",home:"Brazil",away:"Netherlands",hs:3,as:2},
      {round:"Quarter-final",home:"Sweden",away:"Romania",hs:2,as:2,note:"Sweden won on pens"},
      {round:"Semi-final",home:"Italy",away:"Bulgaria",hs:2,as:1},
      {round:"Semi-final",home:"Brazil",away:"Sweden",hs:1,as:0},
      {round:"3rd Place",home:"Sweden",away:"Bulgaria",hs:4,as:0},
      {round:"Final",home:"Brazil",away:"Italy",hs:0,as:0,note:"Brazil won on pens"}
    ]
  },
  1998: {
    groups: {
      "Group A":["Brazil","Norway","Morocco","Scotland"],
      "Group B":["Italy","Chile","Austria","Cameroon"],
      "Group C":["France","Denmark","South Africa","Saudi Arabia"],
      "Group D":["Nigeria","Spain","Paraguay","Bulgaria"],
      "Group E":["Netherlands","Mexico","Belgium","South Korea"],
      "Group F":["Germany","Serbia","Iran","United States"],
      "Group G":["Romania","England","Colombia","Tunisia"],
      "Group H":["Argentina","Croatia","Japan","Jamaica"]
    },
    knockout:[
      {round:"Round of 16",home:"Brazil",away:"Chile",hs:4,as:1},
      {round:"Round of 16",home:"Denmark",away:"Nigeria",hs:4,as:1},
      {round:"Round of 16",home:"France",away:"Paraguay",hs:1,as:0,note:"aet"},
      {round:"Round of 16",home:"Germany",away:"Mexico",hs:2,as:1},
      {round:"Round of 16",home:"Netherlands",away:"Serbia",hs:2,as:1},
      {round:"Round of 16",home:"Romania",away:"Colombia",hs:1,as:0},
      {round:"Round of 16",home:"Italy",away:"Norway",hs:1,as:0},
      {round:"Round of 16",home:"Argentina",away:"England",hs:2,as:2,note:"Argentina won on pens"},
      {round:"Quarter-final",home:"France",away:"Italy",hs:0,as:0,note:"France won on pens"},
      {round:"Quarter-final",home:"Brazil",away:"Denmark",hs:3,as:2},
      {round:"Quarter-final",home:"Netherlands",away:"Argentina",hs:2,as:1},
      {round:"Quarter-final",home:"Croatia",away:"Germany",hs:3,as:0},
      {round:"Semi-final",home:"Brazil",away:"Netherlands",hs:1,as:1,note:"Brazil won on pens"},
      {round:"Semi-final",home:"France",away:"Croatia",hs:2,as:1},
      {round:"3rd Place",home:"Croatia",away:"Netherlands",hs:2,as:1},
      {round:"Final",home:"France",away:"Brazil",hs:3,as:0}
    ]
  },
  2002: {
    groups: {
      "Group A":["Senegal","Denmark","France","Uruguay"],
      "Group B":["Spain","South Africa","Paraguay","Slovenia"],
      "Group C":["Brazil","Turkey","Costa Rica","China"],
      "Group D":["South Korea","United States","Portugal","Poland"],
      "Group E":["Germany","Ireland","Cameroon","Saudi Arabia"],
      "Group F":["Sweden","England","Argentina","Nigeria"],
      "Group G":["Mexico","Croatia","Ecuador","Italy"],
      "Group H":["Japan","Belgium","Russia","Tunisia"]
    },
    knockout:[
      {round:"Round of 16",home:"Germany",away:"Paraguay",hs:1,as:0},
      {round:"Round of 16",home:"England",away:"Denmark",hs:3,as:0},
      {round:"Round of 16",home:"Senegal",away:"Sweden",hs:2,as:1,note:"aet"},
      {round:"Round of 16",home:"Spain",away:"Ireland",hs:1,as:1,note:"Spain won on pens"},
      {round:"Round of 16",home:"United States",away:"Mexico",hs:2,as:0},
      {round:"Round of 16",home:"Brazil",away:"Belgium",hs:2,as:0},
      {round:"Round of 16",home:"South Korea",away:"Italy",hs:2,as:1,note:"aet"},
      {round:"Round of 16",home:"Turkey",away:"Japan",hs:1,as:0},
      {round:"Quarter-final",home:"Germany",away:"United States",hs:1,as:0},
      {round:"Quarter-final",home:"South Korea",away:"Spain",hs:0,as:0,note:"South Korea won on pens"},
      {round:"Quarter-final",home:"Brazil",away:"England",hs:2,as:1},
      {round:"Quarter-final",home:"Turkey",away:"Senegal",hs:1,as:0,note:"Golden goal"},
      {round:"Semi-final",home:"Germany",away:"South Korea",hs:1,as:0},
      {round:"Semi-final",home:"Brazil",away:"Turkey",hs:1,as:0},
      {round:"3rd Place",home:"Turkey",away:"South Korea",hs:3,as:2},
      {round:"Final",home:"Brazil",away:"Germany",hs:2,as:0}
    ]
  },
  2006: {
    groups: {
      "Group A":["Germany","Ecuador","Poland","Costa Rica"],
      "Group B":["England","Sweden","Paraguay","Trinidad and Tobago"],
      "Group C":["Netherlands","Argentina","Ivory Coast","Serbia"],
      "Group D":["Portugal","Mexico","Angola","Iran"],
      "Group E":["Italy","Ghana","United States","Czechia"],
      "Group F":["Brazil","Australia","Croatia","Japan"],
      "Group G":["France","Switzerland","South Korea","Togo"],
      "Group H":["Spain","Ukraine","Tunisia","Saudi Arabia"]
    },
    knockout:[
      {round:"Round of 16",home:"Germany",away:"Sweden",hs:2,as:0},
      {round:"Round of 16",home:"Argentina",away:"Mexico",hs:2,as:1,note:"aet"},
      {round:"Round of 16",home:"England",away:"Ecuador",hs:1,as:0},
      {round:"Round of 16",home:"Portugal",away:"Netherlands",hs:1,as:0},
      {round:"Round of 16",home:"Italy",away:"Australia",hs:1,as:0},
      {round:"Round of 16",home:"Ukraine",away:"Switzerland",hs:0,as:0,note:"Ukraine won on pens"},
      {round:"Round of 16",home:"Brazil",away:"Ghana",hs:3,as:0},
      {round:"Round of 16",home:"France",away:"Spain",hs:3,as:1},
      {round:"Quarter-final",home:"Germany",away:"Argentina",hs:1,as:1,note:"Germany won on pens"},
      {round:"Quarter-final",home:"Italy",away:"Ukraine",hs:3,as:0},
      {round:"Quarter-final",home:"Portugal",away:"England",hs:0,as:0,note:"Portugal won on pens"},
      {round:"Quarter-final",home:"France",away:"Brazil",hs:1,as:0},
      {round:"Semi-final",home:"Germany",away:"Italy",hs:0,as:2,note:"aet"},
      {round:"Semi-final",home:"France",away:"Portugal",hs:1,as:0},
      {round:"3rd Place",home:"Germany",away:"Portugal",hs:3,as:1},
      {round:"Final",home:"Italy",away:"France",hs:1,as:1,note:"Italy won on pens — Zidane headbutt"}
    ]
  },
  2010: {
    groups: {
      "Group A":["Uruguay","Mexico","South Africa","France"],
      "Group B":["Argentina","South Korea","Greece","Nigeria"],
      "Group C":["England","United States","Algeria","Slovenia"],
      "Group D":["Germany","Ghana","Serbia","Australia"],
      "Group E":["Netherlands","Japan","Denmark","Cameroon"],
      "Group F":["Paraguay","Slovakia","Italy","New Zealand"],
      "Group G":["Brazil","Portugal","Ivory Coast","North Korea"],
      "Group H":["Spain","Chile","Switzerland","Honduras"]
    },
    knockout:[
      {round:"Round of 16",home:"Uruguay",away:"South Korea",hs:2,as:1},
      {round:"Round of 16",home:"Ghana",away:"United States",hs:2,as:1,note:"aet"},
      {round:"Round of 16",home:"Germany",away:"England",hs:4,as:1},
      {round:"Round of 16",home:"Argentina",away:"Mexico",hs:3,as:1},
      {round:"Round of 16",home:"Netherlands",away:"Slovakia",hs:2,as:1},
      {round:"Round of 16",home:"Brazil",away:"Chile",hs:3,as:0},
      {round:"Round of 16",home:"Paraguay",away:"Japan",hs:0,as:0,note:"Paraguay won on pens"},
      {round:"Round of 16",home:"Spain",away:"Portugal",hs:1,as:0},
      {round:"Quarter-final",home:"Uruguay",away:"Ghana",hs:1,as:1,note:"Uruguay won on pens"},
      {round:"Quarter-final",home:"Netherlands",away:"Brazil",hs:2,as:1},
      {round:"Quarter-final",home:"Germany",away:"Argentina",hs:4,as:0},
      {round:"Quarter-final",home:"Spain",away:"Paraguay",hs:1,as:0},
      {round:"Semi-final",home:"Netherlands",away:"Uruguay",hs:3,as:2},
      {round:"Semi-final",home:"Spain",away:"Germany",hs:1,as:0},
      {round:"3rd Place",home:"Germany",away:"Uruguay",hs:3,as:2},
      {round:"Final",home:"Netherlands",away:"Spain",hs:0,as:1,note:"aet — Iniesta 116'"}
    ]
  },
  2014: {
    groups: {
      "Group A":["Brazil","Mexico","Croatia","Cameroon"],
      "Group B":["Netherlands","Chile","Spain","Australia"],
      "Group C":["Colombia","Ivory Coast","Greece","Japan"],
      "Group D":["Costa Rica","Uruguay","England","Italy"],
      "Group E":["France","Switzerland","Ecuador","Honduras"],
      "Group F":["Argentina","Nigeria","Bosnia and Herzegovina","Iran"],
      "Group G":["Germany","Ghana","United States","Portugal"],
      "Group H":["Belgium","Algeria","South Korea","Russia"]
    },
    knockout:[
      {round:"Round of 16",home:"Brazil",away:"Chile",hs:1,as:1,note:"Brazil won on pens"},
      {round:"Round of 16",home:"Colombia",away:"Uruguay",hs:2,as:0},
      {round:"Round of 16",home:"France",away:"Nigeria",hs:2,as:0},
      {round:"Round of 16",home:"Germany",away:"Algeria",hs:2,as:1,note:"aet"},
      {round:"Round of 16",home:"Argentina",away:"Switzerland",hs:1,as:0,note:"aet"},
      {round:"Round of 16",home:"Netherlands",away:"Mexico",hs:2,as:1,note:"aet"},
      {round:"Round of 16",home:"Costa Rica",away:"Greece",hs:1,as:1,note:"Costa Rica won on pens"},
      {round:"Round of 16",home:"Belgium",away:"United States",hs:2,as:1,note:"aet"},
      {round:"Quarter-final",home:"France",away:"Germany",hs:0,as:1},
      {round:"Quarter-final",home:"Brazil",away:"Colombia",hs:2,as:1},
      {round:"Quarter-final",home:"Argentina",away:"Belgium",hs:1,as:0},
      {round:"Quarter-final",home:"Netherlands",away:"Costa Rica",hs:0,as:0,note:"Netherlands won on pens"},
      {round:"Semi-final",home:"Brazil",away:"Germany",hs:1,as:7,note:"The Mineirazo"},
      {round:"Semi-final",home:"Netherlands",away:"Argentina",hs:0,as:0,note:"Argentina won on pens"},
      {round:"3rd Place",home:"Brazil",away:"Netherlands",hs:0,as:3},
      {round:"Final",home:"Germany",away:"Argentina",hs:1,as:0,note:"aet — Götze 113'"}
    ]
  },
  2018: {
    groups: {
      "Group A":["Uruguay","Russia","Saudi Arabia","Egypt"],
      "Group B":["Spain","Portugal","Morocco","Iran"],
      "Group C":["France","Denmark","Peru","Australia"],
      "Group D":["Croatia","Argentina","Nigeria","Iceland"],
      "Group E":["Brazil","Switzerland","Serbia","Costa Rica"],
      "Group F":["Sweden","Mexico","South Korea","Germany"],
      "Group G":["Belgium","England","Tunisia","Panama"],
      "Group H":["Colombia","Japan","Poland","Senegal"]
    },
    knockout:[
      {round:"Round of 16",home:"France",away:"Argentina",hs:4,as:3},
      {round:"Round of 16",home:"Uruguay",away:"Portugal",hs:2,as:1},
      {round:"Round of 16",home:"Russia",away:"Spain",hs:1,as:1,note:"Russia won on pens"},
      {round:"Round of 16",home:"Croatia",away:"Denmark",hs:1,as:1,note:"Croatia won on pens"},
      {round:"Round of 16",home:"Brazil",away:"Mexico",hs:2,as:0},
      {round:"Round of 16",home:"Belgium",away:"Japan",hs:3,as:2},
      {round:"Round of 16",home:"Sweden",away:"Switzerland",hs:1,as:0},
      {round:"Round of 16",home:"England",away:"Colombia",hs:1,as:1,note:"England won on pens"},
      {round:"Quarter-final",home:"France",away:"Uruguay",hs:2,as:0},
      {round:"Quarter-final",home:"Croatia",away:"Russia",hs:2,as:2,note:"Croatia won on pens"},
      {round:"Quarter-final",home:"England",away:"Sweden",hs:2,as:0},
      {round:"Quarter-final",home:"Belgium",away:"Brazil",hs:2,as:1},
      {round:"Semi-final",home:"France",away:"Belgium",hs:1,as:0},
      {round:"Semi-final",home:"Croatia",away:"England",hs:2,as:1,note:"aet"},
      {round:"3rd Place",home:"Belgium",away:"England",hs:2,as:0},
      {round:"Final",home:"France",away:"Croatia",hs:4,as:2}
    ]
  },
  2022: {
    groups: {
      "Group A":["Netherlands","Senegal","Ecuador","Qatar"],
      "Group B":["England","United States","Wales","Iran"],
      "Group C":["Argentina","Poland","Mexico","Saudi Arabia"],
      "Group D":["France","Australia","Tunisia","Denmark"],
      "Group E":["Japan","Spain","Germany","Costa Rica"],
      "Group F":["Morocco","Croatia","Belgium","Canada"],
      "Group G":["Brazil","Switzerland","Serbia","Cameroon"],
      "Group H":["Portugal","South Korea","Uruguay","Ghana"]
    },
    knockout:[
      {round:"Round of 16",home:"Netherlands",away:"United States",hs:3,as:1},
      {round:"Round of 16",home:"Argentina",away:"Australia",hs:2,as:1},
      {round:"Round of 16",home:"France",away:"Poland",hs:3,as:1},
      {round:"Round of 16",home:"England",away:"Senegal",hs:3,as:0},
      {round:"Round of 16",home:"Japan",away:"Croatia",hs:1,as:1,note:"Croatia won on pens"},
      {round:"Round of 16",home:"Brazil",away:"South Korea",hs:4,as:1},
      {round:"Round of 16",home:"Morocco",away:"Spain",hs:0,as:0,note:"Morocco won on pens"},
      {round:"Round of 16",home:"Portugal",away:"Switzerland",hs:6,as:1},
      {round:"Quarter-final",home:"Croatia",away:"Brazil",hs:1,as:1,note:"Croatia won on pens"},
      {round:"Quarter-final",home:"Netherlands",away:"Argentina",hs:2,as:2,note:"Argentina won on pens"},
      {round:"Quarter-final",home:"Morocco",away:"Portugal",hs:1,as:0},
      {round:"Quarter-final",home:"England",away:"France",hs:1,as:2},
      {round:"Semi-final",home:"Argentina",away:"Croatia",hs:3,as:0},
      {round:"Semi-final",home:"France",away:"Morocco",hs:2,as:0},
      {round:"3rd Place",home:"Croatia",away:"Morocco",hs:2,as:1},
      {round:"Final",home:"Argentina",away:"France",hs:3,as:3,note:"Argentina won on pens — Mbappé hat-trick"}
    ]
  }
};
