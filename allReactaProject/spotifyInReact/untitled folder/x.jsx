
function Main() {

    const data = [
        { id: 1, title: 'Liked Songs', img_url: 'https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/Liked.png?raw=true' },
        { id: 2, title: 'Neffex Playlist', img_url: 'https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/image4.png?raw=true' },
        { id: 3, title: 'K/ DA', img_url: 'https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/image3.png?raw=true' },
        { id: 4, title: 'Liked Songs', img_url: 'https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/image1.png?raw=true' },
        { id: 5, title: 'Dance/Electronic Mix', img_url: 'https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/image2.png?raw=true' }
    ]

    const shows = [
        {
            id: 1, title: 'Weekly Motiation...', img_url: 'https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/image9.png?raw=true', by: 'Ben Ins Scott'
        }, {
            id: 2, title: 'MEDITATION SELF', img_url: 'https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/image8.png?raw=true', by: 'Ben Ins Scott'

        }, {
            id: 3, title: 'Word beyond act...', img_url: 'https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/image7.png?raw=true', by: 'Ben Ins Scott'

        }, {
            id: 4, title: 'The Alexa Show', img_url: 'https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/image6.png?raw=true', by: 'Ben Ins Scott'

        }, {
            id: 5, title: 'The Stories of Ma...', img_url: 'https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/image5.png?raw=true', by: 'Ben Ins Scott'

        }, {
            id: 6, title: 'Motivation Daily b...', img_url: 'https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/image10.png?raw=true', by: 'Ben Ins Scott'

        }
    ]
    return (
        <>
            <div className="main">
                <div className="top-bar">
                    <div className="arrows">
                        <a href=""><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/top%20arrow%20navigation.png?raw=true" alt="" /></a>
                    </div>
                    <div className="user"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/10.spotify-clone/assets/User.png?raw=true" alt="" /></div>
                </div>

                <h2>Good Morning</h2>
                <div className="songs">
                    {data.map((i) => (
                        <div key={i.id} className="music">
                            <img src={i.img_url} alt={i.title} />
                            <p>{i.title}</p>
                        </div>))}
               
                        </div>


                <h3>
                    Shows you might like
                </h3>
                <div className="shows">

                    {shows.map((i) => (
                        <div key={i.id} className="show">
                            <img src={i.img_url} alt={i.title} />
                            <p>{i.title}</p>
                            <span>{i.by}</span>

                        </div>
                    ))}


                </div> </div>
         </>)}

            export default Main



            import React from "react";
import '../components/../App.css'

function Homepage() {
    return (
        <>
            <div className="searchbar">
                <div className="search"><p1>search</p1>
                    <div className="search_icone"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/search.png?raw=true" alt="" /></div>
                </div>
                <div className="items">
                    <div className="mic"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/mic.png?raw=true" alt="" /></div>
                    <div className="create it"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/create.png?raw=true" alt="" /></div>
                    <div className="find it"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/more.png?raw=true" alt="" /></div>
                    <div className="bell it"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/bell.png?raw=true" alt="" /></div>
                    <div className="profile it"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/Ellipse%201%20(6).png?raw=true" alt="" /></div>
                </div>
            </div>
            <div className="option">
                <div className="text1">all</div>
                <div className="text1">Coke Studio</div>
                <div className="text1">UX</div>
                <div className="text1">Case Study</div>
                <div className="text1">Music</div>
                <div className="text1">Bnagla Lofi</div>
                <div className="text1">Tour</div>
                <div className="text1">Saintmartin</div>
                <div className="text1">Tech</div>
                <div className="text1">iPhone 13</div>
                <div className="text1">User Interface Design</div>
                <div className="text1">Computer</div>
            </div>
            <div className="component">
                <div className="r1">
                    <div className="c1">
                    <div className="photo1"></div>
                    <div className="text">
                        <div className="first">
                        <div className="logo1"><img src="https://github.com/PatelNeelMahesh/frontend_tasks/blob/main/02.youtube-clone/assets/Ellipse%204%20(1).png?raw=true" alt="" /></div>
                        <div className="textfirst"><p3>Bulbuli | Coke Studio Bangla |
                        Season One | Ritu Raj X Nandita</p3></div>
                        </div></div>
                    </div>
                    <div className="c1">
                    <div className="photo1"></div>
                    <div className="text"></div>
                    </div>
                    <div className="c1">
                    <div className="photo1"></div>
                    <div className="text"></div>
                    </div>
                    <div className="c1">
                    <div className="photo1"></div>
                    <div className="text"></div>
                    </div>
                </div>
                <div className="r1">
                    <div className="c1">
                    <div className="photo1"></div>
                    <div className="text"></div>
                    </div>
                    <div className="c1">
                    <div className="photo1"></div>
                    <div className="text"></div>
                    </div>
                    <div className="c1">
                    <div className="photo1"></div>
                    <div className="text"></div>
                    </div>
                    <div className="c1">
                    <div className="photo1"></div>
                    <div className="text"></div>
                    </div>
                </div>
                <div className="r1">
                    <div className="c1">
                    <div className="photo1"></div>
                    <div className="text"></div>
                    </div>
                    <div className="c1">
                    <div className="photo1"></div>
                    <div className="text"></div>
                    </div>
                    <div className="c1">
                    <div className="photo1"></div>
                    <div className="text"></div>
                    </div>
                    <div className="c1">
                    <div className="photo1"></div>
                    <div className="text"></div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Homepage;




*{
    margin: 0px;
    padding: 0px;
    /* border: 1px solid rgb(255, 0, 0); */
  }
  .main{
    display: flex;
    width: 1278px;
    border: 1px solid rgb(255, 255, 255);
    height: 710px;
  }
  .slidebar{
    border: 1px solid rgb(255, 255, 255);
    height: 500px;
    width: 220px;
  }
  .searchbar{
    border: 1px solid rgb(255, 255, 255);
    height: 50px;
    width: 1058px;
  }
  .options{
    border: 1px solid rgb(255, 255, 255);
    height: 50px;
    width: 1058px;
  }
  .content{
    border: 1px solid rgb(255, 255, 255);
    height: 600px;
    width: 1058px;;
  }
  .logo{
    display: flex;
    width:220px;
    height: 50px;
    align-items: center;
    margin-bottom: 12px;
  }
  .img1{
    
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    margin-left: 20px;
  }
  .img2{
    
    display: flex;
    justify-content: center;
    align-items: center;
    
  }
  .details1{
    /* border: 1px solid rgb(255, 255, 255);   */
  }
  .home1{
    display: flex;
    width:220px;
    height: 40px;
    align-items: center;
    background-color: #383838;
  }
  .home{
    margin-top: -5px;
    display: flex;
    width:220px;
    height: 40px;
    align-items: center;
  }
  .img{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    margin-left: 20px;
  }
  .text{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .details2{
    /* border: 1px solid rgb(220, 61, 61); */
    margin-top: 5px;
  }
  .line{
    width: 200px;
    border: 1px solid rgb(97, 93, 93);
    margin-top: 7px;
  }
  .text{
    font-size: small;
  }
  .searchbar{
    display: flex;
  align-items: center;  
  }
  .search{
    display: flex;
    border: 1px solid rgb(255, 255, 255);
    height: 30px;
    width: 500px;
    margin-left: 120px;
  }
  .search_icone{
    display: flex;
    align-items: center;
    justify-content: center;
    /* border: 1px solid rgb(255, 255, 255); */
    height: 30px;
    width: 80px;
    margin-left: 410px;
  }
  .it{
    display: flex;
    /* border: 1px solid red; */
    margin-left: 20px;
  }
  .items{
    display: flex;
    margin-left: 230px;
    
  }
  .mic{
    margin-left: -230px;
    margin-right: 200px;
  }
  p1{
    margin-left: 10px;
  }
  .option{
    display: flex;
    align-items: center;
    height: 50px;
    border: 1px solid white;
  }
  .text1{
    display: flex;
    align-items: center;
    font-size: small;
    justify-content: center;
    height: 30px;
    border: 1px solid white;
    margin-left: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 30px;
  }
  .r1{
    display: flex;
    border: 1px solid white;
    height: 200px;
  }
  .photo1{
    display: flex;
    border: 1px solid rgb(202, 59, 59);
    height: 120px;
    width: 262.5px;
  }
  .photo2{
    display: flex;
    border: 1px solid rgb(202, 59, 59);
    height: 100px;
    width: 262.5px;
  }
  .photo3{
    display: flex;
    border: 1px solid rgb(202, 59, 59);
    height: 100px;
    width: 262.5px;
  }
  .photo4{
    display: flex;
    border: 1px solid rgb(202, 59, 59);
    height: 100px;
    width: 262.5px;
  }
  .r2{
    display: flex;
    border: 1px solid white;
    height: 200px;
  }
  .r3{
    display: flex;
    border: 1px solid white;
    height: 200px;
  }
  .c1{
    border: 1px solid rgb(255, 255, 255);
    height: 200px;
    width: 262.5px;
  }
  .first{
    height: 35px;
    border: 1px solid blue;
    display: flex;
    line-height: 15px;
    font-size: small;
  }
  .textfirst{
    border: 1px solid rgb(145, 255, 0);
    width: 200px;
  }