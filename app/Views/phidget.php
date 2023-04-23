<div class="container-fluid">

 <div class="row m-2">
   <div class="col-auto"><h3><img src="https://static.abls-habitat.fr/img/phidget_hub5000.jpg" style="width:80px" alt="Phidget HB5000">Liste des HUB5000 Phidgets</h3></div>
   <div class ="ml-auto btn-group align-items-center">
        <button type="button" onclick="PHIDGET_Add()" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter une connexion</button>
        <button type="button" onclick="PHIDGET_Refresh()" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
   </div>
 </div>

<hr>

    <div class="table-responsive">
     <table id="idTablePHIDGET" class="table table-striped table-bordered table-hover">
       <thead class="thead-dark">
       </thead>
       <tbody>
       </tbody>
     </table>
    </div>

<hr>

<div class="col-auto"><h3><img src="https://static.abls-habitat.fr/img/wago_750342.webp" style="width:80px" alt="Wago 750-342">Configuration des I/O Phidget</h3></div>

<ul class="nav nav-tabs" role="tablist">
  <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#idTabEntreeTor">
        <img style="width: 30px" data-toggle="tooltip" title="Entrées TOR" src="https://static.abls-habitat.fr/img/entree.png" />Entrées TOR</a></li>
  <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#idTabEntreeAna">
        <img style="width: 30px" data-toggle="tooltip" title="Entrées ANA" src="https://static.abls-habitat.fr/img/entree_analogique.png" />Entrées ANA</a></li>
  <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#idTabSortieTor">
        <img style="width: 30px" data-toggle="tooltip" title="Sorties TOR" src="https://static.abls-habitat.fr/img/sortie.png" />Sorties TOR</a></li>
  <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#idTabSortieAna">
        <img style="width: 30px" data-toggle="tooltip" title="Sorties ANA" src="https://static.abls-habitat.fr/img/sortie_analogique.png" />Sorties ANA</a></li>
</ul>

<div class="tab-content">
<!----------------------------------------------------------------------------------------------------------------------------->
<div id="idTabEntreeTor" class="tab-pane fade in table-responsive mt-1" role="tabpanel">

 <div class="row m-2">
   <div class ="ml-auto btn-group">
        <button type="button" onclick="PHIDGET_Add_DI(null)" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter une DI</button>
   </div>
 </div>
    <table id="idTablePHIDGET_DI" class="table table-striped table-bordered table-hover w-100">
      <thead class="thead-dark">
				  </thead>
			   <tbody>
      </tbody>
    </table>
</div>

<!----------------------------------------------------------------------------------------------------------------------------->
<div id="idTabSortieTor" class="tab-pane fade in table-responsive mt-1" role="tabpanel">

 <div class="row m-2">
   <div class ="ml-auto btn-group">
        <button type="button" onclick="PHIDGET_Add_DO(null)" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter une DO</button>
   </div>
 </div>

    <table id="idTablePHIDGET_DO" class="table table-striped table-bordered table-hover w-100">
      <thead class="thead-dark">
				  </thead>
			   <tbody>
      </tbody>
    </table>
</div>
<!----------------------------------------------------------------------------------------------------------------------------->
<div id="idTabEntreeAna" class="tab-pane fade in table-responsive mt-1" role="tabpanel">

 <div class="row m-2">
   <div class ="ml-auto btn-group">
        <button type="button" onclick="PHIDGET_Add_AI(null)" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter une AI</button>
   </div>
 </div>

    <table id="idTablePHIDGET_AI" class="table table-striped table-bordered table-hover w-100">
      <thead class="thead-dark">
				  </thead>
			   <tbody>
      </tbody>
    </table>
</div>
<!----------------------------------------------------------------------------------------------------------------------------->
<div id="idTabSortieAna" class="tab-pane fade in table-responsive mt-1" role="tabpanel">
 <div class="row m-2">
   <div class ="ml-auto btn-group">
        <button type="button" onclick="PHIDGET_Add_AO(null)" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter une AO</button>
   </div>
 </div>
    <table id="idTablePHIDGET_AO" class="table table-striped table-bordered table-hover w-100">
      <thead class="thead-dark">
				  </thead>
			   <tbody>
      </tbody>
    </table>
 </div>

<!----------------------------------------------------------------------------------------------------------------------------->
</div> <!-- TabContent -->

<!-- Container -->
</div>

<!----------------------------------------------------------------------------------------------------------------------------->

<div id="idPHIDGETEdit" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idPHIDGETTitre"></span></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div class="modal-body">
       <div class="col form-group">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Choix de l'agent</label>
           <select id="idTargetAgent" class="custom-select border-info"></select>
          </div>
       </div>

       <div class="col form-group">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">TechID</label>
           <input id="idPHIDGETTechID" required type="text" class="form-control" placeholder="Tech ID du module">
          </div>
        </div>

       <div class="col form-group">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Description</label>
           <input id="idPHIDGETDescription" type="text" class="form-control" placeholder="Ou est le hub ?">
          </div>
        </div>

       <div class="col form-group">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Hostname</label>
           <input id="idPHIDGETHostname" required type="text" class="form-control" maxlength="32" placeholder="@IP ou hostname">
          </div>
        </div>

       <div class="col form-group">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Mot de passe</label>
           <input id="idPHIDGETPassword" required type="text" class="form-control" placeholder="Mot de passe de connexion">
          </div>
        </div>

       <div class="col form-group">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Serial Number</label>
           <input id="idPHIDGETSerial" required type="number" class="form-control" placeholder="Serial Number">
          </div>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idPHIDGETValider" type="button" class="btn btn-primary" data-dismiss="modal"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<script src="/js/phidget.js" type="text/javascript"></script>
