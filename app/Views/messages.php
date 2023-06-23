<div class="container-fluid">

 <div class="row m-2">
   <h3><i class="fas fa-book text-primary"></i> Liste des Messages</strong></h3>

<!--   <div class ="ml-auto btn-group align-items-start">
        <button type="button" onclick="SYN_Add()" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter un Synoptique</button>
   </div> -->
 </div>

<hr>

<div class="table-responsive">
  <table id="idTableMESSAGES" class="table table-striped table-bordered table-hover">
    <thead class="thead-dark">
				</thead>
			 <tbody>
    </tbody>
  </table>
</div>


<!-- Container -->
</div>


<div id="idMSGEdit" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content ">
      <div class="modal-header bg-info text-white">
        <h5 class="modal-title text-justify"><i class="fas fa-pen"></i> <span id="idMSGEditTitre"></span></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

       <div class="col form-group">
					     <div class="input-group">
						     <label class="col-5 col-sm-4 col-form-label text-right">Libellé</label>
						     <input id="idMSGEditLibelle" type="text" class="form-control" disabled placeholder="Libellé du Message">
     					</div>
       </div>

       <div class="col form-group">
					     <div class="input-group">
						     <label class="col-5 col-sm-4 col-form-label text-right">Zone de Diffusion Sonore</label>
						     <select id="idMSGEditAudioZone" class="col-7 col-sm-8 custom-select border-info">
           </select>
     					</div>
       </div>

       <div class="col form-group">
					     <div class="input-group">
						     <label class="col-5 col-sm-4 col-form-label text-right">Libellé audio</label>
						     <input id="idMSGEditAudioLibelle" type="text" class="form-control" placeholder="Libellé audio du Message">
     					</div>
       </div>

       <div class="col form-group">
					     <div class="input-group">
						     <label class="col-5 col-sm-4 col-form-label text-right">Envoi SMS</label>
						     <select id="idMSGEditSmsNotification" class="col-7 col-sm-8 custom-select border-info">
           </select>
     					</div>
       </div>

       <div class="col form-group">
          <div class="input-group">
           <label class="col-5 col-sm-4 col-form-label text-right">Rate limit</label>
           <input id="idMSGEditRateLimit" type="number" required min=0 max=300 class="form-control" placeholder="seconde entre 2 messages">
           <div class="input-group-append">
             <div class="input-group-text">secondes</div>
           </div>
          </div>
       </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fas fa-times"></i> Annuler</button>
        <button id="idMSGEditValider" type="button" class="btn btn-primary" data-dismiss="modal"><i class="fas fa-save"></i> Valider</button>
      </div>
    </div>
  </div>
</div>

<script src="/js/messages.js" type="text/javascript"></script>
