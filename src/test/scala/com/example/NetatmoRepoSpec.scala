package com.example

import org.junit.runner.RunWith
import org.specs2.mutable.Specification
import org.specs2.runner.JUnitRunner
import spray.http.StatusCodes._
import spray.http._
import spray.testkit.Specs2RouteTest

import scala.concurrent.Await
import scala.concurrent.duration.Duration

@RunWith(classOf[JUnitRunner])
class NetatmoRepoSpec extends Specification {

  val netatmo : NetatmoRepository = new NetatmoRepository

  "NetatmoRepo" should {

    "get Spray.io page" in {

      Await.result(netatmo.getPage("http://www.norgesbesterapper.no"), Duration(3, "sec")).status.intValue must beEqualTo(200)
    }

    "get 404 page" in {

      Await.result(netatmo.getPage("http://www.norgesbesterapper.no/test"), Duration(3, "sec")).status.intValue must beEqualTo(404)
    }
  }
}
