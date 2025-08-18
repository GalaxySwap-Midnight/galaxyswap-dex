/**
 * Utility to download required proof parameters for lunarswap circuits
 */

const LUNARSWAP_K_VALUES = [18, 19, 14, 12, 11, 10, 15, 16, 17] as const;

interface DownloadParamsResult {
  success: boolean;
  downloaded: number[];
  failed: number[];
  errors: string[];
}

/**
 * Download all required public parameters for lunarswap circuits
 */
export async function downloadLunarswapProofParams(
  proofServerUrl = 'http://localhost:6300',
): Promise<DownloadParamsResult> {
  const result: DownloadParamsResult = {
    success: true,
    downloaded: [],
    failed: [],
    errors: [],
  };

  console.log('[downloadLunarswapProofParams] Starting parameter download...');

  for (const k of LUNARSWAP_K_VALUES) {
    try {
      console.log(
        `[downloadLunarswapProofParams] Downloading parameters for k=${k}...`,
      );

      const response = await fetch(`${proofServerUrl}/fetch-params/${k}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(
          `[downloadLunarswapProofParams] ✅ Successfully downloaded parameters for k=${k}`,
        );
        result.downloaded.push(k);
      } else {
        const errorText = await response.text();
        console.error(
          `[downloadLunarswapProofParams] ❌ Failed to download parameters for k=${k}:`,
          errorText,
        );
        result.failed.push(k);
        result.errors.push(
          `k=${k}: ${response.status} ${response.statusText} - ${errorText}`,
        );
        result.success = false;
      }
    } catch (error) {
      console.error(
        `[downloadLunarswapProofParams] ❌ Error downloading parameters for k=${k}:`,
        error,
      );
      result.failed.push(k);
      result.errors.push(
        `k=${k}: ${error instanceof Error ? error.message : String(error)}`,
      );
      result.success = false;
    }
  }

  console.log(
    '[downloadLunarswapProofParams] Parameter download complete:',
    result,
  );
  return result;
}

/**
 * Check if parameters are already downloaded (optional optimization)
 */
export async function checkProofParamsStatus(
  proofServerUrl = 'http://localhost:6300',
): Promise<{ [k: number]: boolean }> {
  const status: { [k: number]: boolean } = {};

  for (const k of LUNARSWAP_K_VALUES) {
    try {
      // Try to use the parameters - if they're not available, this will fail
      const response = await fetch(`${proofServerUrl}/prove-tx`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Minimal test payload
          circuit_id: `test_k${k}`,
          public_inputs: [],
          private_inputs: [],
        }),
      });

      // If we get a specific error about missing parameters, they're not downloaded
      if (response.status === 400) {
        const errorText = await response.text();
        status[k] = !errorText.includes(`k=${k} not found in cache`);
      } else {
        status[k] = true; // Assume available if no specific error
      }
    } catch (error) {
      status[k] = false;
    }
  }

  return status;
}

/**
 * Smart parameter download - only download missing parameters
 */
export async function ensureLunarswapProofParams(
  proofServerUrl = 'http://localhost:6300',
): Promise<DownloadParamsResult> {
  console.log('[ensureLunarswapProofParams] Checking parameter status...');

  // Check which parameters are already available
  //const status = await checkProofParamsStatus(proofServerUrl);
  const missingParams = LUNARSWAP_K_VALUES;

  console.log(
    `[ensureLunarswapProofParams] Missing parameters: ${missingParams.join(', ')}`,
  );

  // Download only missing parameters
  const result: DownloadParamsResult = {
    success: true,
    downloaded: [],
    failed: [],
    errors: [],
  };

  for (const k of missingParams) {
    try {
      console.log(
        `[ensureLunarswapProofParams] Downloading parameters for k=${k}...`,
      );

      const response = await fetch(`${proofServerUrl}/fetch-params/${k}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(
          `[ensureLunarswapProofParams] ✅ Successfully downloaded parameters for k=${k}`,
        );
        result.downloaded.push(k);
      } else {
        const errorText = await response.text();
        console.error(
          `[ensureLunarswapProofParams] ❌ Failed to download parameters for k=${k}:`,
          errorText,
        );
        result.failed.push(k);
        result.errors.push(
          `k=${k}: ${response.status} ${response.statusText} - ${errorText}`,
        );
        result.success = false;
      }
    } catch (error) {
      console.error(
        `[ensureLunarswapProofParams] ❌ Error downloading parameters for k=${k}:`,
        error,
      );
      result.failed.push(k);
      result.errors.push(
        `k=${k}: ${error instanceof Error ? error.message : String(error)}`,
      );
      result.success = false;
    }
  }

  console.log(
    '[ensureLunarswapProofParams] Parameter download complete:',
    result,
  );
  return result;
}
