package com.example

class NetatmoRepository {

  import scala.concurrent.Future
  import scala.concurrent.duration._

  import akka.actor.ActorSystem
  import akka.util.Timeout
  import akka.pattern.ask
  import akka.io.IO

  import spray.can.Http
  import spray.http._
  import spray.httpx.RequestBuilding._

  implicit val system: ActorSystem = ActorSystem()
  implicit val timeout: Timeout = Timeout(15.seconds)

  def getPage(url: String): Future[HttpResponse] = {
    val response: Future[HttpResponse] =
      (IO(Http) ? Get(url)).mapTo[HttpResponse]
    response
  }

}
