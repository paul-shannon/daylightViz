class Radicals {

  data = [{"radical":"ləx̌","definition":"be light, be bright, be illuminated","lines":[21,59,102,106,108,113,114]},
          {"radical":"bəsad","definition":"be dark","lines":[2,22,55]},
          {"radical":"had","definition":"talk","lines": [3]},
          {"radical":"čal","definition":"chase; catch.","lines":[16,69,71,83,86,87,88,93]},
          {"radical":"kʷəd","definition":"be taken","lines":[3,4,36,37,46,74,77,81,104]},
          {"radical":"q̓xʷ", "definition":"be upstream","lines":[4,19]},
          {"radical":"huyu", "definition": "do, make, prepare", "lines": [5,7,8,12,43,45,50,51,111]},
          {"radical":"c̓agʷa", "definition": "washed", "lines": [6]},
          {"radical":"xʷəxʷaʔxʷəʔ", "definition": "be swift", "lines": [7,71,77,86,88]},
          {"radical":"təlawil", "definition": "run a distance", "lines": [7,38,85]},
          {"radical":"t̓əd", "definition": "be in a row, lined up", "lines": [9]},
          {"radical":"tədᶻil", "definition": "lie in bed", "lines": [47,60,61,114]},
          {"radical":"saxʷəb", "definition": "jump", "lines": [9,11,13,15,60,68,72,79,85]},
          {"radical":"x̌ək̓ʷ", "definition": "overturned", "lines": [10,13,14]},
          {"radical":"cut", "definition": "speak", "lines": [16,30,34,41,47,48,91,99]},
          {"radical":"ʔux̌ʷ", "definition": "go", "lines": [17,18,19,27,28,33,38,45,57,66,67,94]},
          {"radical":"gʷaʔxʷ", "definition": "walk", "lines": [18,19,24,25]},
          {"radical":"ʔuluɬ", "definition": "travel by water", "lines": [18,89,90]},
          {"radical":"č̓it", "definition": "be near", "lines": [20,23,97,101]},
          {"radical":"hay", "definition": "know", "lines": [23,27,28,32]},
          {"radical":"ɬaɬlil", "definition": "live", "lines": [26]},
          {"radical":"ʔa", "definition": "be there", "lines": [16,20,26]},
          {"radical":"ʔiwəd", "definition": "decide", "lines": [27]},
          {"radical":"dukʷ", "definition": "be abnormal", "lines": [28]},
          {"radical":"qada", "definition": "steal", "lines": [29]},
          {"radical":"hədʔiw̓", "definition": "be indoors", "lines": [30,32]},
          {"radical":"kayiɬ", "definition": "pretend", "lines": [31]},
          {"radical":"qʷəlub", "definition": "have gray hair", "lines": [31,39]},
          {"radical":"ck̓usəd", "definition": "use walking stick", "lines": [32,39]},
          {"radical":"ʔəƛ̓", "definition": "come", "lines": [35,44,100,103]},
          {"radical":"gʷəč̓", "definition": "search", "lines": [44,100]},
          {"radical":"ɬaq̓", "definition": "fall,lie,lay", "lines": [43,44,50]},
          {"radical":"haʔɬ", "definition": "be good,nice, beautiful", "lines": [45,116]},
          {"radical":"ʔalq̓ʷ", "definition": "be away from fire", "lines": [47]},
          {"radical":"šədᶻal", "definition": "go outdoors", "lines": [48]},
          {"radical":"ɬax̌", "definition": "be dark", "lines": [48,54,66,106,110,110,113]},
          {"radical":"ləq̓aɬ", "definition": "be in correct place", "lines": [49,50,65]},
          {"radical":"wač", "definition": "watch", "lines": [51,52,56,105]},
          {"radical":"ƛ̓ip̓", "definition": "grip,squeeze", "lines": [36,53]},
          {"radical":"ƛ̓uc̓", "definition": "pull together, bunch up", "lines": [55]},
          {"radical":"ɬaʔ", "definition": "arrive there", "lines": [58,67]},
          {"radical":"puʔu", "definition": "blow", "lines": [62]},
          {"radical":"pəd", "definition": "buried", "lines": [65]},
          {"radical":"ɬaɬlil", "definition": "live", "lines": [26]},
          {"radical":"wəq̓", "definition": "blink", "lines": [64,]},
          {"radical":"šuɬ", "definition": "look,see", "lines": [40,65]},
          {"radical":"bəč", "definition": "fall", "lines": [65]},
          {"radical":"pəkʷib", "definition": "snatch, peel off", "lines": [68]},
          {"radical":"ɬčil", "definition": "arrive", "lines": [25,36,38,40,]},
          {"radical":"ʔix̌ʷ", "definition": "throw away", "lines": [73,82]},
          {"radical":"šəq", "definition": "be high", "lines": [75,80,85]},
          {"radical":"č̓əlp", "definition": "twist, turn", "lines": [75]},
          {"radical":"qʷiq̓ʷ", "definition": "be strong", "lines": [78]},
          {"radical":"saq̓ʷ", "definition": "fly", "lines": [80]},
          {"radical":"q̓ʷəɬəb", "definition": "be tired", "lines": [82]},
          {"radical":"lil", "definition": "be far", "lines": [84]},
          {"radical":"q̓il", "definition": "be on board", "lines": [89]},
          {"radical":"qʷšab", "definition": "be foggy", "lines": [90,92,93]},
          {"radical":"laʔ", "definition": "locate, point out", "lines": [92]},
          {"radical":"gʷəq", "definition": "be bright", "lines": [98]},
          {"radical":"ʔitut", "definition": "sleep", "lines": [107]},
          {"radical":"šəɬ", "definition": "make", "lines": [111]},
          {"radical":"šac̓", "definition": "finished", "lines": [115]}
         ];

    constructor(){
       console.log("Radicals class ctor");
       window.data = this.data;
       }

    getRoots(){
      return(this.data.map(function(x){return x.radical}))
      }
    getCount(radical){
      const entry = this.data.filter(function(x){return(x.radical == radical)})
      return(entry[0]['lines'].length)
      }

} // class Radicals
