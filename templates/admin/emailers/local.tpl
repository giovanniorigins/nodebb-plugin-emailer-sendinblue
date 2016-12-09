<h1><i class="fa fa-envelope-o"></i> Emailer SendInBlue API</h1>

<div class="row">
	<div class="col-lg-12">
		<blockquote>
			Plugin for NodeBB allowing you to send e-mail via SendInBlue V2 API.
		</blockquote>
	</div>
</div>

<hr />

<form role="form" class="emailer-local-settings">
	<fieldset>
		<div class="row">
			<div class="col-sm-12">
				<div class="form-group">
					<label for="emailer:local:apikey">Api Key</label>
					<input type="text" class="form-control" id="emailer:local:apikey" name="emailer:local:apikey" />
					<span class="help-block">You can find this or create a new one at <a href="https://account.sendinblue.com/advanced/api/">https://account.sendinblue.com/advanced/api/</a></span>
				</div>
			</div>
			<div class="col-sm-12">
				<div class="form-group">
					<label for="emailer:local:timeout">Timeout</label>
					<input type="number" class="form-control" value="5000" id="emailer:local:timeout" name="emailer:local:timeout" />
					<span class="help-block">(Optional) Timeout in MS</span>
				</div>
			</div>

		</div>

		<button class="btn btn-lg btn-primary" id="save">Save</button>
	</fieldset>
</form>

<script type="text/javascript">
	require(['settings'], function(Settings) {
		Settings.load('emailer-local', $('.emailer-local-settings'));
		$('#save').on('click', function() {
			Settings.save('emailer-local', $('.emailer-local-settings'), function() {
				app.alert({
					alert_id: 'emailer-local',
					type: 'info',
					title: 'Settings Changed',
					message: 'Please reload your NodeBB to apply these changes',
					timeout: 5000,
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	});
</script>
