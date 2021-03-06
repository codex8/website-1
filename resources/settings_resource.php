<?php
class_exists("member") || require("models/member.php");
class_exists("app_resource") || require("app_resource.php");
class settings_resource extends app_resource{
	function __construct($request, $url){
		parent::__construct($request, $url);
	}
	public $member;
	function GET(){
		$this->member = site::$member;
		// Null these out before rendering in the view.
		$this->member->password = null;
		$this->member->hash = null;
		$this->output = view::render("settings/index", $this);
		return layout::render("default", $this);
	}
	function POST(){
		$this->member = site::$member;
		// Null these out before rendering in the view.
		// Null these out before rendering in the view.
		$this->member->password = null;
		$this->member->hash = null;
		$this->output = view::render("settings/edit", $this);
		return layout::render("default", $this);
	}
	
	function PUT(member $member, $site_title = null){
		$this->member = auth_controller::$current_user;
		$this->member->in_directory = $member->in_directory;
		$this->member->timestamp = gmmktime();
		$this->member->colophon = $member->colophon;
		$this->member->set_settings("site_title", $site_title);
		notification_center::publish("should_save_member", $this, $this->member);
		if(in_array($this->url->file_type, array("html"))) self::redirect("settings");
		// Null these out before rendering in the view.
		$this->member->password = null;
		$this->member->hash = null;
		$this->output = view::render("settings/index", $this);
		return layout::render("default", $this);
	}
	/*
	function GET(){
		$this->settings = storage::find_settings(null);
		$this->output = view::render("settings/index", $this);
		return layout::render("default", $this);
	}
	function POST(){
		$this->output = view::render("settings/edit", $this);
		return layout::render("default", $this);
	}*/
}
