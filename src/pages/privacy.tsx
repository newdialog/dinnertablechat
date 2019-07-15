import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { Helmet } from 'react-helmet';

import Footer from '../components/home/Footer';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing(20)
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 300px)',
    // gridGap: `${theme.spacing(3)}px`,
    marginTop: '60px',
    alignItems: 'center',
    // gridAutoFlow: 'column',
    // gridAutoColumns: '200px'
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr'
    }
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1)
  },
  centered: {
    marginTop: '60px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'auto',
    maxWidth: '800px',
    minWidth: '300px',
    padding: '0 12px 0 12px'
  },
  centeredDown: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: '5em',
    color: '#ffffff88',
    textAlign: 'center'
  },
  divider: {
    margin: `${theme.spacing(2)}px 0`
  },
  banner: {
    display: 'flex',
    objectFit: 'cover',
    width: '100%',
    height: 'calc(100vh - 0px)',
    backgroundImage: 'url("./banner.jpg")',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center 0',
    color: 'white',
    // justifyContent: 'center',
    justifyContent: 'flex-end',
    flexFlow: 'column nowrap'
  },
  bannerText: {
    fontFamily: 'Open Sans',
    color: 'white',
    bottom: '20%',
    marginBottom: '15vh',
    backgroundColor: '#00000044',
    fontWeight: 'bold'
  },
  logoanim: {
    width: '100vw',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex'
  },
  largeIcon: {
    width: 80,
    height: 60
  },
  body: {
    /*
      width: '100%',
      backgroundImage: 'url("./imgs/07-newsletter.png")', // DTC-scene3.png
      backgroundSize: 'cover',
      // backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom 0px left'
      */
  },
  paperimg: {
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 'auto',
    width: 'auto',
    maxWidth: '300px',
    minWidth: '200px',
    margin: 0,
    display: 'block',
    objectFit: 'contain',
    pointerEvents: 'none',
    [theme.breakpoints.down('sm')]: {
      paddingTop: `${theme.spacing(5)}px`
      // maxWidth: '80%'
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100px'
    }
  }
}));

interface Props {
}

export default function Privacy(props: Props) {
  const classes = useStyles({});
  return (
    <React.Fragment>
      <Helmet title="Dinnertable.chat Privacy">
        <meta itemProp="name" content="Dinnertable.chat Privacy" />
        <meta name="og:url" content="https://www.dinnertable.chat/privacy" />
        <meta name="og:title" content="Dinnertable.chat Privacy" />
      </Helmet>
      <div className={classes.centered}>
        <p>
          <strong>Dinnertable.chat Privacy Policy</strong>
        </p>

        <p>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit or make a microtransaction
          purchase from https://www.dinnertable.chat (the "Site").
        </p>

        <p>PERSONAL INFORMATION WE COLLECT</p>

        <p>
          When you visit the Site, we automatically collect certain information
          about your device, including information about your web browser, IP
          address, time zone, and some of the cookies that are installed on your
          device. Additionally, as you browse the Site, we collect information
          about the individual web pages or products that you view, what
          websites or search terms referred you to the Site, and information
          about how you interact with the Site. We refer to this
          automatically-collected information as "Device Information."
        </p>

        <p>We collect Device Information using the following technologies:</p>

        <div>
          - "Cookies" are data files that are placed on your device or computer
          and often include an anonymous unique identifier. For more information
          about cookies, and how to disable cookies, visit
          http://www.allaboutcookies.org. - "Log files" track actions occurring
          on the Site, and collect data including your IP address, browser type,
          Internet service provider, referring/exit pages, and date/time stamps.
          - "Web beacons," tags, and pixels are electronic files used to record
          information about how you browse the Site.
        </div>

        <p>
          Additionally when you make a purchase or attempt to make a purchase
          through the Site, we collect certain information from you, including
          your name, billing address, shipping address, payment information
          (including credit card numbers, crypto wallet addresses, etc), email
          address, and phone number. We refer to this information as "Order
          Information."
        </p>

        <p>
          When we talk about "Personal Information" in this Privacy Policy, we
          are talking both about Device Information and Order Information.
        </p>

        <p>HOW DO WE USE YOUR PERSONAL INFORMATION?</p>

        <p>
          We use the Microtransaction Information that we collect generally to
          fulfill any purchases placed through the Site. Additionally, we use
          this Order Information to:
        </p>

        <p>Communicate with you;</p>

        <p>Screen our orders for potential risk or fraud; and</p>

        <p>
          When in line with the preferences you have shared with us, provide you
          with information or advertising relating to our products or services.
        </p>

        <p>
          We also may request the user to share and validate their phone number,
          for the sole purpose of bot prevention and mitigating bad actors on
          the platform.
        </p>

        <p>
          We use the Device Information that we collect to help us screen for
          potential risk and fraud (in particular, your IP address), and more
          generally to improve and optimize our Site (for example, by generating
          analytics about how our customers browse and interact with the Site,
          and to assess the success of our marketing and advertising campaigns).
        </p>

        <p>SHARING YOUR PERSONAL INFORMATION</p>

        <p>
          We share your Personal Information with third parties to help us use
          your Personal Information, as described above. For example, we may use
          a payment processor to handle transactions, but we will include here
          links to their privacy policies. We also use Google Analytics to help
          us understand how our customers use the Site--you can read more about
          how Google uses your Personal Information here:
          https://www.google.com/intl/en/policies/privacy/. You can also opt-out
          of Google Analytics here: https://tools.google.com/dlpage/gaoptout.
        </p>

        <p>
          Finally, we may also share your Personal Information to comply with
          applicable laws and regulations, to respond to a subpoena, search
          warrant or other lawful request for information we receive, or to
          otherwise protect our rights.
        </p>

        <p>YOUR RIGHTS</p>

        <p>
          If you are a European resident, you have the right to access personal
          information we hold about you and to ask that your personal
          information be corrected, updated, or deleted. If you would like to
          exercise this right, please contact us through the contact information
          below.
        </p>

        <p>
          Additionally, if you are a European resident we note that we are
          processing your information in order to fulfill application services
          you use, or otherwise to pursue our legitimate business interests
          listed above. Additionally, please note that your information will be
          transferred outside of Europe, including to Canada and the United
          States.
        </p>

        <p>DATA RETENTION</p>

        <p>
          When you place an order through the Site, we will maintain your Order
          Information for our records unless and until you ask us to delete this
          information.
        </p>

        <p>MINORS</p>

        <p>
          The Site is not intended for individuals under the age of 13, due to
          strong language.
        </p>

        <p>CHANGES</p>

        <p>
          We may update this privacy policy from time to time in order to
          reflect, for example, changes to our practices or for other
          operational, legal or regulatory reasons.
        </p>

        <p>CONTACT US</p>

        <p>
          For more information about our privacy practices, if you have
          questions, or if you would like to make a complaint, please contact us
          by e-mail at admin@dinnertable.chat.
        </p>
      </div>
      <Footer />
    </React.Fragment>
  );
}
