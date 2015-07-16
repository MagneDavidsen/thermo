package com.example

import scala.concurrent.Await


class NetatmoRepository {

  import akka.actor.ActorSystem
  import akka.io.IO
  import akka.pattern.ask
  import akka.util.Timeout
  import spray.http._
  import spray.httpx.RequestBuilding._

  import dispatch._
  import scala.concurrent.ExecutionContext
  import ExecutionContext.Implicits.global

  import scala.concurrent.Future
  import scala.concurrent.duration._

  implicit val system: ActorSystem = ActorSystem()
  implicit val timeout: Timeout = Timeout(15.seconds)

  val grantType: String = "password"
  val authUrl: String = "https://api.netatmo.net/oauth2/token"
  val clientId: String = "52950de91877595f647d369d"
  val clientSecret: String = "gvcp2iYBaGYiWT6Aev7N1NTHjUcuc32B8PnYIpzNM"
  val username: String = "magne.davidsen@gmail.com"
  val password: String = "47oirai"
  val scope: String = "read_station"


  def getToken() = {

    val myPost = url(authUrl).POST.addParameter("grant_type", grantType).addParameter("client_id", clientId).addParameter("client_secret", clientSecret).addParameter("username", username).addParameter("password", password).addParameter("scope", scope)

    println(myPost.toString)

    val response = Http(myPost)

    val actualResponse = Await.result(response, Duration(3, "sec")).getResponseBody()

    response
  }
}
