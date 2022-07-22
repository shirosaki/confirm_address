<?php
/**
 * Confirm Adress
 * Show confirm address dialog before sending a maii.
 *
 * @version 1.0
 * @author Hiroshi Shirosaki
 */

class confirm_address extends rcube_plugin
{
  public function init()
  {
    $rcmail = rcube::get_instance();

    if ($rcmail->task === 'mail' && $rcmail->action === 'compose') {
      // Load plugin configuration
      $this->load_config();
      $mail_domain = $rcmail->config->get('confirm_address_my_domain');
      if ($mail_domain == '') {
        $mail_domain = $rcmail->config->get('mail_domain');
      }
      $rcmail->output->set_env('confirm_address_my_domain', $mail_domain);

      $this->add_texts('localization/', true);
      $this->include_script('addressparser.js');
      $this->include_script('confirm_address.js');
      $this->include_stylesheet("confirm_address.css");
    }
  }
}
