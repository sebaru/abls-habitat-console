<div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-link text-primary"></i> Connecteurs et Mappings</h3>
 </div>

<hr>

<h4><i class="fas fa-link text-primary"></i> Connecteurs</h4>
<div class="row justify-content-center row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4">

 <div class="card shadow m-1 bg-light">
   <div class="card-header text-center">Les I/O Wago</div>
   <a href="/modbus"><img src="https://static.abls-habitat.fr/img/wago_750342.webp" class="card-img-top wtd-img-connecteur" alt="Wago 750-342"></a>
   <div class="card-body text-center">
        <button type="button" onclick="Redirect('/modbus')" class="btn btn-primary btn-sm"><i class="fas fa-list"></i> Configurer</button>
   </div>
 </div>

 <div class="card shadow m-1 bg-light">
   <div class="card-header text-center">Les GSM</div>
   <a href="/smsg"><img src="https://static.abls-habitat.fr/img/sms.jpg" class="card-img-top wtd-img-connecteur" alt="GSM"></a>
   <div class="card-body text-center">
        <button type="button" onclick="Redirect('/smsg')" class="btn btn-primary btn-sm"><i class="fas fa-list"></i> Configurer</button>
   </div>
 </div>

 <div class="card shadow m-1 bg-light">
   <div class="card-header text-center">La Messagerie XMPP</div>
   <a href="/imsgs"><img src="https://static.abls-habitat.fr/img/imsgs.png" class="card-img-top wtd-img-connecteur" alt="Messagerie XMPP"></a>
   <div class="card-body text-center">
        <button type="button" onclick="Redirect('/imsgs')" class="btn btn-primary btn-sm"><i class="fas fa-list"></i> Configurer</button>
   </div>
 </div>

 <div class="card shadow m-1 bg-light">
   <div class="card-header text-center">Diffusion Audio</div>
   <a href="/audio"><img src="https://static.abls-habitat.fr/img/audio.png" class="card-img-top wtd-img-connecteur" alt="Diffusion Audio"></a>
   <div class="card-body text-center">
        <button type="button" onclick="Redirect('/audio')" class="btn btn-primary btn-sm"><i class="fas fa-list"></i> Configurer</button>
   </div>
 </div>

 <div class="card shadow m-1 bg-light">
   <div class="card-header text-center">Les Onduleurs</div>
   <a href="/ups"><img src="https://static.abls-habitat.fr/img/onduleur.jpg" class="card-img-top wtd-img-connecteur" alt="Onduleurs"></a>
   <div class="card-body text-center">
        <button type="button" onclick="Redirect('/ups')" class="btn btn-primary btn-sm"><i class="fas fa-list"></i> Configurer</button>
   </div>
 </div>

 <div class="card shadow m-1 bg-light">
   <div class="card-header text-center">Les Raspberry PI</div>
   <a href="/gpiod"><img src="https://static.abls-habitat.fr/img/raspberrypi.png" class="card-img-top wtd-img-connecteur" alt="RaspberryPI"></a>
   <div class="card-body text-center">
        <button type="button" onclick="Redirect('/gpiod')" class="btn btn-primary btn-sm"><i class="fas fa-list"></i> Configurer</button>
   </div>
 </div>

 <div class="card shadow m-1 bg-light">
   <div class="card-header text-center">Les Compteurs EDF</div>
   <a href="/teleinfoedf"><img src="https://static.abls-habitat.fr/img/linky.jpg" class="card-img-top wtd-img-connecteur" alt="Compteurs EDF"></a>
   <div class="card-body text-center">
        <button type="button" onclick="Redirect('/teleinfoedf')" class="btn btn-primary btn-sm"><i class="fas fa-list"></i> Configurer</button>
   </div>
 </div>

 <div class="card shadow m-1 bg-light">
   <div class="card-header text-center">Les Radios</div>
   <a href="/radio"><img src="https://static.abls-habitat.fr/img/radio.png" class="card-img-top wtd-img-connecteur" alt="Radio"></a>
   <div class="card-body text-center">
        <button type="button" onclick="Redirect('/radio')" class="btn btn-primary btn-sm"><i class="fas fa-list"></i> Configurer</button>
   </div>
 </div>

 <div class="card shadow m-1 bg-light">
   <div class="card-header text-center">La Méteo</div>
   <a href="/meteo"><img src="https://static.abls-habitat.fr/img/meteo.svg" class="card-img-top wtd-img-connecteur" alt="La météo"></a>
   <div class="card-body text-center">
        <button type="button" onclick="Redirect('/meteo')" class="btn btn-primary btn-sm"><i class="fas fa-list"></i> Configurer</button>
   </div>
 </div>

 <div class="card shadow m-1 bg-light">
   <div class="card-header text-center">Les Phidgets</div>
   <a href="/phidget"><img src="https://static.abls-habitat.fr/img/phidget_hub5000.jpg" class="card-img-top wtd-img-connecteur" alt="Phidget"></a>
   <div class="card-body text-center">
        <button type="button" onclick="Redirect('/phidget')" class="btn btn-primary btn-sm"><i class="fas fa-list"></i> Configurer</button>
        <button type="button" onclick="Redirect('/phidget_map')" class="btn btn-primary btn-sm"><i class="fas fa-directions"></i> Mapper</button>
   </div>
 </div>

</div>

<hr>
<h4><i class="fas fa-directions text-primary"></i> Mappings Textes et Vocaux</h4>
<div class="row justify-content-center row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4">

 <div class="card shadow m-1 bg-light">
   <div class="card-header text-center">Mappings TEXTE</div>
   <a href="/command_text"><img src="https://static.abls-habitat.fr/img/commande_texte.png" class="card-img-top wtd-img-connecteur" alt="Commandes Text"></a>
   <div class="card-body text-center">
        <button type="button" onclick="Redirect('/command_text')" class="btn btn-primary btn-sm"><i class="fas fa-directions"></i> Mapper</button>
   </div>
 </div>

 <div class="card shadow m-1 bg-light">
   <div class="card-header text-center">Les I/O Vocales</div>
   <a href="/command_voc"><img src="https://static.abls-habitat.fr/img/commande_vocale.jpg" class="card-img-top wtd-img-connecteur" alt="Commandes Vocales"></a>
   <div class="card-body text-center">
        <button type="button" onclick="Redirect('/command_vocale')" class="btn btn-primary"><i class="fas fa-directions"></i> Mapper</button>
   </div>
 </div>

</div>


</div>
