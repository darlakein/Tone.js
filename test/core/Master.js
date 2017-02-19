define(["Test", "Tone/core/Master", "Tone/core/Tone", "helper/Offline", "helper/PassAudio", 
	"Tone/source/Oscillator", "helper/BufferTest"], 
	function (Test, Master, Tone, Offline, PassAudio, Oscillator, BufferTest) {

	describe("Master", function(){
		it ("exists", function(){
			expect(Tone.Master).to.exist;
		});

		it ("provides a toMaster method", function(){
			expect(Tone.prototype.toMaster).is.a("function");
			expect(AudioNode.prototype.toMaster).is.a("function");
		});

		it ("can be muted and unmuted", function(){
			Tone.Master.mute = false;
			expect(Tone.Master.mute).to.be.false;
			Tone.Master.mute = true;
			expect(Tone.Master.mute).to.be.true;
		});

		it ("passes audio through", function(){
			return PassAudio(function(input){
				input.toMaster();
			});
		});

		it ("passes no audio when muted", function(){
			return Offline(function(){
				new Oscillator().toMaster().start(0);
				Tone.Master.mute = true;
			}, 0.01).then(function(buffer){
				expect(BufferTest.isSilent(buffer));
			});
		});

		it ("has a master volume control", function(){
			return Offline(function(){
				Tone.Master.volume.value = -20;
				expect(Tone.Master.volume.value).to.be.closeTo(-20, 0.1);
			});
		});

		it ("can pass audio through chained nodes", function(){
			return PassAudio(function(input){
				var gain = Tone.context.createGain();
				input.connect(gain);
				Tone.Master.chain(gain);
			});
		});
	});
});