const ACTIVE_CAMPAIGN_ENDPOINT =
  'https://cefincapacitacion.activehosted.com/proc.php?jsonp=true';

function isActiveCampaignError(responseText) {
  return responseText.includes('_show_error(') || responseText.includes('Lo sentimos');
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const activeCampaignResponse = await fetch(ACTIVE_CAMPAIGN_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json, text/javascript, */*',
      },
    });

    const responseText = await activeCampaignResponse.text();

    if (!activeCampaignResponse.ok || isActiveCampaignError(responseText)) {
      return Response.json(
        {
          ok: false,
          message:
            'ActiveCampaign no pudo guardar el registro. Revisa los datos e intenta de nuevo.',
        },
        { status: 400 }
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      {
        ok: false,
        message: 'No se pudo enviar el registro. Intenta de nuevo.',
      },
      { status: 500 }
    );
  }
}
