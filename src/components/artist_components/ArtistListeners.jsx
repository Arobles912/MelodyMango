import "./styles/ArtistListeners.css"
import listenerImg from "../../assets/bg_images/main-home-image2.jpeg"
import CardArrows from "../profile_components/CardArrows"
import { useState } from "react";

export default function ArtistListeners(){
    const [currentListenerIndex, setCurrentListenerIndex] = useState(0);

    return(
        <div className="listeners-div">
        <h2>
          Top Listeners
        </h2>
        <div className="listeners-list">
            <div className="listener-list">
              <img src="" alt="listener-img" />
              <div className="listener-info">
                <p className="listener-title">
                    Listener name
                </p>
              </div>
            </div>
        </div>
        <CardArrows
          currentIndex={currentListenerIndex}
          setIndex={setCurrentListenerIndex}
          length={10}
        />
      </div>
    )
}