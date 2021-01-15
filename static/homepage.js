document.getElementById('pathSet-1').style.display = 'none'
document.getElementById('plane2').style.display = "none"
document.getElementById('pathSet-2').style.display = 'none'
document.getElementById('plane1').style.display = "none"

let viaFlights = []
let directFlights = []
let optiFlight = []

function displayPath() {

    setTimeout(() => {

        document.getElementById('pathSet-1').style.display = 'block'
        // document.getElementById('plane2').style.display = "block"
        // document.getElementById('pathSet-2').style.display ='block'
        document.getElementById('plane1').style.display = "block"

    }, 300)


}

$(".btn").click(searchFlights)



let planeNodes = ["delhi", "jaipur", "ahmedabad", "mumbai", "hyderabad", "kolkata", "bangalore"]

const INFINITY = 9999

//dijkstra(G, n, startnode)
var G = [
    [0, 1, 2, 3, 4, 5, 6],
    [1, 0, 2, 3, 4, 5, 6],
    [3, 1, 0, 2, 4, 6, 5],
    [5, 4, 1, 0, 2, 6, 3],
    [6, 5, 3, 2, 0, 4, 1],
    [2, 3, 4, 5, 1, 0, 6],
    [6, 5, 3, 2, 1, 4, 0],
];


var n = 7;
var u = 6;





function dijkstra(G, n, startnode, endnode) {
    var pred = [0, 0, 0, 0, 0]
    var visited, count, mindistance, nextnode, i, j
    var cost = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ]

    var distance = [0, 0, 0, 0, 0, 0, 0]
    var visited = [0, 0, 0, 0, 0, 0, 0]

    for (i = 0; i < n; i++)
        for (j = 0; j < n; j++)
            if (G[i][j] == 0)
                cost[i][j] = INFINITY;
            else
                cost[i][j] = G[i][j];



    for (i = 0; i < n; i++) {
        distance[i] = cost[startnode][i];
        pred[i] = startnode;
        visited[i] = 0;
    }
    distance[startnode] = 0;
    visited[startnode] = 1;
    count = 1;


    while (count < n - 1) {
        mindistance = INFINITY;
        for (i = 0; i < n; i++)
            if (distance[i] < mindistance && !visited[i]) {
                mindistance = distance[i];
                nextnode = i;
            }
        visited[nextnode] = 1;
        for (i = 0; i < n; i++)
            if (!visited[i])
                if (mindistance + cost[nextnode][i] < distance[i]) {
                    distance[i] = mindistance + cost[nextnode][i];
                    pred[i] = nextnode;
                }
        count++;
    }


    for (i = 0; i < n; i++)
        if (i == endnode) {
            //cout<<"\nDistance of node"<<i<<"="<<distance[i];
            console.log(`Distance from node ${u} to node ${i} = ${distance[i]}`)
            // cout<<"\nPath="<<i;
            let path = []
            path.push(i)
            j = i;
            do {
                j = pred[j];
                // cout<<"<-"<<j;
                path.push(j)
            } while (j != startnode);
            path.reverse()
            console.log(path)
            //     path = path.join('->')
            //   console.log(`shortest path : ${path}`)
            //   console.log('')
            console.log(planeNodes[path[1]])
            return planeNodes[path[1]]
        }
}



function searchFlights() {

    var startplace = $('#start').val().toLowerCase();
    var endplace = $('#end').val().toLowerCase();
    console.log("start", startplace)
    var start = planeNodes.indexOf(startplace)
    var end = planeNodes.indexOf(endplace)
    console.log(start, end)
    var temp = G[start][end]
    G[start][end] = 99
    u = start
    let viaplace = dijkstra(G, n, u, end);
    console.log(viaplace)
    G[start][end] = temp;

    var data = {
        start: startplace,
        end: endplace,
        via: viaplace
    }
    // headers: {
    //   "Authorisation": "Bearer " + sessionStorage.getItem('token')
    // },
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    console.log(options)

    fetch("/getViaDetails", options).then((res) => res.json().then((data) => {
        console.log(data)
        //viaFlights=[]
        viaFlights = data.slice()
        //console.log(viaFlights, "abhra")
        document.getElementById('logoMotion').style.display="none"

        console.log(viaFlights, "abhra")
        displayPath()
        // updateViaCard(viaFlights)
        //console.log(viaFlights[1].arrival.slice(0,2), "ghosh")
        // data.sort((a, b) => {
        //     return a.price - b.price;
        // });
        // console.log(data)
        //console.log("abhra ghosh")
        // let message = data;
        // console.log(data.message) 
        // document.getElementById('post').innerHTML = data.message;
    })).then((data) => {
        fetch("/getDirectDetails", options).then((res) => res.json().then((data) => {
            console.log("direct flights data" + data)
            var arr = [...data]
            console.log(arr) //direct flight
            updateDirectCard(data)
            //console.log("abhra ghosh"
            // let message = data;
            // console.log(data.message)
            // document.getElementById('post').innerHTML = data.message;
        }))

    }).then((data) => {

        fetch("/optimisedVia", options).then((res) => res.json().then((data) => {
            console.log("optimised via", data)
            optiFlight = data.slice()
            console.log(optiFlight)
            //console.log("why were chainsaws invented")
            // let message = data;
            // console.log(data.message)
            // document.getElementById('post').innerHTML = data.message;
            matchViaOpti()
         
        }))
    })

    function matchViaOpti() {
        console.log("via")
        console.log(viaFlights)
        console.log("opt")
        console.log(optiFlight)
        for (let i = 0; i < viaFlights.length; i++) {
            console.log(viaFlights[i].flight_num,'abcd',optiFlight.flight_num)
            if (viaFlights[i].flight_num == optiFlight[0].flight_num) {
                viaFlights.splice(i, 1);
               
            }

            // console.log("match")
        }
        viaFlights.unshift(optiFlight[0])
       //viaFlights[4] = optiFlight[0]
        //viaFlights.reverse()
        console.log(viaFlights)
        updateViaCard(viaFlights)
        
    }

}

function searchFlightsOnReload() {

    var startplace = sessionStorage.getItem('source').toLowerCase();
    var endplace = sessionStorage.getItem('destination').toLowerCase();
    //console.log("start", startplace)
    var start = planeNodes.indexOf(startplace)
    var end = planeNodes.indexOf(endplace)
    console.log(start, end)
    var temp = G[start][end]
    G[start][end] = 99
    u = start
    let viaplace = dijkstra(G, n, u, end);
    console.log(viaplace)
    G[start][end] = temp;

    var data = {
        start: startplace,
        end: endplace,
        via: viaplace
    }
    // headers: {
    //   "Authorisation": "Bearer " + sessionStorage.getItem('token')
    // },
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    console.log(options)

    fetch("/getViaDetails", options).then((res) => res.json().then((data) => {
        console.log(data)
        //viaFlights=[]
        viaFlights = data.slice()
        //console.log(viaFlights, "abhra")

        console.log(viaFlights, "abhra")
        displayPath()
        // updateViaCard(viaFlights)
        //console.log(viaFlights[1].arrival.slice(0,2), "ghosh")
        // data.sort((a, b) => {
        //     return a.price - b.price;
        // });
        // console.log(data)
        //console.log("abhra ghosh")
        // let message = data;
        // console.log(data.message) 
        // document.getElementById('post').innerHTML = data.message;
    })).then((data) => {
        fetch("/getDirectDetails", options).then((res) => res.json().then((data) => {
            console.log("direct flights data" + data)
            var arr = [...data]
            console.log(arr) //direct flight
            updateDirectCard(data)
            //console.log("abhra ghosh"
            // let message = data;
            // console.log(data.message)
            // document.getElementById('post').innerHTML = data.message;
        }))

    }).then((data) => {

        fetch("/optimisedVia", options).then((res) => res.json().then((data) => {
            console.log("optimised via", data)
            optiFlight = data.slice()
            console.log(optiFlight)
            //console.log("why were chainsaws invented")
            // let message = data;
            // console.log(data.message)
            // document.getElementById('post').innerHTML = data.message;
            matchViaOpti()
           
        }))
    })

    function matchViaOpti() {
        console.log("via")
        console.log(viaFlights)
        console.log("opt")
        console.log(optiFlight)
        for (let i = 0; i < viaFlights.length; i++) {
            console.log(viaFlights[i].flight_num,'abcd',optiFlight.flight_num)
            if (viaFlights[i].flight_num == optiFlight[0].flight_num) {
                viaFlights.splice(i, 1);
               
            }

            // console.log("match")
        }
        viaFlights.unshift(optiFlight[0])
       //viaFlights[4] = optiFlight[0]
        //viaFlights.reverse()
        console.log(viaFlights)
        updateViaCard(viaFlights)
        
    }

}


function sortPrice() {


    if(sessionStorage.getItem('class')=="Economy"){

        let j
        let itemPrice
        for (let i = 0; i < viaFlights.length; i++) {
            j = i - 1;
            itemPrice = viaFlights[i].e_price
            itemObj = viaFlights[i]
            while (j >= 0 && itemPrice < viaFlights[j].e_price) {
                viaFlights[j + 1] = viaFlights[j]
                j--
            }
            viaFlights[j + 1] = itemObj
        }
        console.log("price sorted",viaFlights)
        sortAll(viaFlights,optiFlight)
        
    }else{
        let j
        let itemPrice
        for (let i = 0; i < viaFlights.length; i++) {
            j = i - 1;
            itemPrice = viaFlights[i].b_price
            itemObj = viaFlights[i]
            while (j >= 0 && itemPrice < viaFlights[j].b_price) {
                viaFlights[j + 1] = viaFlights[j]
                j--
            }
            viaFlights[j + 1] = itemObj
        }
        console.log("price sorted",viaFlights)
        sortAll(viaFlights,optiFlight)
    }
    
}

function sortArrivalTime() {

    let j
    //let itemTime
    for (let i = 0; i < viaFlights.length; i++) {
        j = i - 1;
        let itemTimeH = viaFlights[i].arrival.slice(0, 2)
        let itemTimeM = viaFlights[i].arrival.slice(2, 4)
        let itemTimeTotal = itemTimeH + itemTimeM
        let itemObj = viaFlights[i]
        while (j >= 0 && itemTimeTotal < viaFlights[j].arrival.slice(0, 2) + viaFlights[j].arrival.slice(2, 4)) {
            viaFlights[j + 1] = viaFlights[j]
            j--
        }
        viaFlights[j + 1] = itemObj
    }

    console.log("at sorted",viaFlights)
    sortAll(viaFlights,optiFlight)
}

function sortDepartureTime() {

    let j
    //let itemTime
    for (let i = 0; i < viaFlights.length; i++) {
        j = i - 1;
        let itemTimeH = viaFlights[i].departure.slice(0, 2)
        let itemTimeM = viaFlights[i].departure.slice(2, 4)
        let itemTimeTotal = itemTimeH + itemTimeM
        let itemObj = viaFlights[i]
        while (j >= 0 && itemTimeTotal < viaFlights[j].departure.slice(0, 2) + viaFlights[j].departure.slice(2, 4)) {
            viaFlights[j + 1] = viaFlights[j]
            j--
        }
        viaFlights[j + 1] = itemObj
    }
    
    console.log("dt sorted",viaFlights)
    sortAll(viaFlights,optiFlight)

}

$(".sort-price").on('click',sortPrice)
$(".sort-at").on('click',sortArrivalTime)
$(".sort-dt").on('click',sortDepartureTime)

function selectFlight() {
    window.location.assign("app.html")
}

function showPastBookings() {

}
