<?php

require_once dirname(__FILE__) . '/../../WobbleApi/Autoload.php';

class TopicListServiceTest extends PHPUnit_Framework_TestCase {
  public function testSearch() {
    $result = TopicListService::search(7, 'Wobble');

    $this->assertNotNull($result);
  }

  function testEmptyHtml() {
    $expected = array('headline' => '', 'text' => '');
    $html = '';

    $this->assertEquals($expected, TopicListService::createAbstract($html));
  }

  # Would be nice, but is to much work to implement :(
  #function testHeadlineWithParialFormatting() {
  #  $expected = array('headline' => 'Hallo Welt', 'text' => 'Text');
  #  $html = '<b>Hallo</b> Welt<div>Text</div>';
  #
  #  $this->assertEquals($expected, TopicListService::createAbstract($html));
  #}

  function testParseSimpleHtml() {
    $expected = array('headline' => 'Demo #1', 'text' => 'Hallo Ihr!');
    $html = 'Demo #1<div>Hallo Ihr!</div>';
    
    $this->assertEquals($expected, TopicListService::createAbstract($html));
  }

  function testParseSimpleHtml1() {
    $expected = array(
      'headline' => 'iPhone LogIn Problem', 
      'text' => 'Hey Stephan, ich kann mich per'
    );
    $html = 'iPhone LogIn Problem<div><br></div><div>Hey Stephan, ich kann mich per iPhone nicht mehr bei Wobble einloggen. Vor ein paar Tagen gings noch. Wenn ich versuch mich einzuloggen komm ich direkt wieder zum login screen.</div>';
    
    $this->assertEquals($expected, TopicListService::createAbstract($html));
  }
  
  function testParseNoHtml() {
    $expected = array('headline' => 'Yeah baby!', 'text' => null);
    $html = 'Yeah baby!';
    $this->assertEquals($expected, TopicListService::createAbstract($html));
  }
  
  function testHeadlineInHtml() {
    $expected = array('headline' => 'London - Reise', 'text' => 'Di, 10.1. - 20.1. =&gt; 10 Üb');
    $html = '<b>London - Reise</b><div><br></div><div>Di, 10.1. - 20.1. =&gt; 10 Übernachtungen / 11 Tage</div>';
    $this->assertEquals($expected, TopicListService::createAbstract($html));
  }
  
  function testHeadlineRealLiveRuskaja() {
    $expected = array (
      'headline' => 'Russkaja am 30.3. in Mannheim',
      'text' => 'Die gute Gruppe Russkaja spiel'
    );
    $html = 'Russkaja am 30.3. in Mannheim<br><br>Die gute Gruppe Russkaja spielt ein Konzert, ' . 
            'für dieses Jahr das einzige das halbwegs in der Nähe ist. Ich fänds toll, wenn wir da' . 
            ' hin fahren, das Ticket kostet nur 17 Euro, da kann man ein bisschen Spritkosten doch ' . 
            'verkraften! Die sind sooo hammergeil. Das muss jeder mal gesehen haben :)<br><br>Ich würde ' . 
            'auch fahren.<br><br><div>Beginn - 21 Uhr</div><div><br><div>Wer ist dabei?<br><br><ul><li>' . 
            'Diana<br></li><li>Dani<br></li><li>Maik</li><li>Dimi</li><li>Laura <br></li></ul><br></div></div>';
    $this->assertEquals($expected, TopicListService::createAbstract($html));
  }
  
  function testHeadlineRealLiveAdcloud() {
    $expected = array (
      'headline' => 'Adcloud Developer - And there was Light!&nbsp;',
      'text' => 'Die nachfolgende Aufgabe gilt '
    );
    $html = <<<EOL





    <p class="p1"><b>Adcloud Developer - And there was Light!&nbsp;</b></p>
    <p class="p3">Die nachfolgende Aufgabe gilt es nicht mit â€œrichtigâ€ oder â€œfalschâ€ zu bewerten. Noch liegt der&nbsp;Fokus auf der Fertigstellung. Die Aufgabe dient der Diskussionsgrundlage zwischen dem&nbsp;bestehenden Team und einem neuen Entwickler. Es gilt eine Software zu entwickeln. Es gibt&nbsp;keinerlei EinschrÃ¤nkungen bzgl. verwendeter Technologien, Frameworks oder Bibliotheken.&nbsp;</p>
    <p class="p3"><b>Hintergrund<span class="s1">&nbsp;</span></b></p>
    <p class="p2">&nbsp;â€œLight!â€ stellt eine neue Platform zum Austausch von Quellcode dar. Sie soll als Webservice&nbsp;verfÃ¼gbar sein. Jeder Eintrag wird als â€œLightningâ€ bezeichnet. Es gibt verschiedene&nbsp;Benutzerrollen mit unterschiedlichen Rechten zur Benutzung, Moderierung und Administration&nbsp;der Platform und deren Inhalte. Das Finanzierungsmodell sieht bislang Werbeplatzierungen&nbsp;sowie Premium-Accounts vor.<span class="s1">&nbsp;</span></p>
    <p class="p3"><b>Problemstellung<span class="s1">&nbsp;</span></b>&nbsp;</p>
    <p class="p3">Sie sollen die Konzeption der Software vornehmen und letztendlich einen ersten Prototypen&nbsp;umsetzen. Dabei sind stehen Kriterien wie <b>Wartbarkeit (+</b><b>Erweiterbarkeit)</b>, <b>Testbarkeit</b>, <b>Sicherheit&nbsp;</b>und <b>Performanz </b>im Vordergrund. Geben Sie Ausblick, wie Sie diesen Kriterien nachkommen&nbsp;und wie Sie mit diesen die QualitÃ¤t der ausgelieferten Software messen kÃ¶nnen.<span class="s1">&nbsp;</span></p>
    <p class="p3"><b>Aufgaben<span class="s1">&nbsp;</span></b></p>
    <p class="p3">Entwerfen Sie ein Konzept zur Umsetzung der Software.&nbsp;</p>
    <p class="p3">â€¢ Software Architektur<span class="s1">&nbsp;</span></p>
    <p class="p3">â€¢ <strike>Technologische Architektur<span class="s1">&nbsp;</span></strike></p>
    <p class="p2">&nbsp;</p>
    <p class="p3">Entwickeln Sie einen ersten Prototypen.<span class="s1">&nbsp;</span></p>
    <p class="p3">â€¢ <strike>Entwerfen Sie einen prioristierten Anforderungskatalog.</strike><span class="s1">&nbsp;</span></p>
    <p class="p3">â€¢ Setzen Sie diese Anforderungen entsprechend um.<span class="s1">&nbsp;</span></p>
    <p class="p3">â€¢ BegrÃ¼nden Sie jede Entscheidung auf dem Weg zum ersten Prototypen. &nbsp;</p>
    <p class="p2">&nbsp;</p>
    <p class="p3">Stellen Sie Ihren Prototypen dem Team vor.<span class="s1">&nbsp;</span></p>
    <p class="p3">â€¢ Stellen Sie Ihre gewÃ¤hlten Metriken zur Messung der QualitÃ¤t Ihrer Arbeit vor.&nbsp;</p>
    <p class="p3">â€¢ Stellen Sie die Software auf technischer Basis vor.</p>
EOL;
    $this->assertEquals($expected, TopicListService::createAbstract($html));
  }

  public function testHeadlineInvalidContent() {
    $expected = array (
      'headline' => 'Foo',
      'text' => ''
    );
    $input = '<b>Foo</b>';
    $this->assertEquals($expected, TopicListService::createAbstract($input));

    $expected = array (
      'headline' => '',
      'text' => ''
    );
    $input = '<b';
    $this->assertEquals($expected, TopicListService::createAbstract($input));

    $expected = array (
      'headline' => '',
      'text' => ''
    );
    $input = '<a href="http://heise.de"';
    $this->assertEquals($expected, TopicListService::createAbstract($input));

    $expected = array (
      'headline' => 'Foo Bar',
      'text' => ''
    );
    $input = '<a href="http://heise.de">Foo Bar';
    $this->assertEquals($expected, TopicListService::createAbstract($input));
  }
}
